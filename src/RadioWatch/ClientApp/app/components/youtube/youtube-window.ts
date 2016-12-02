import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { IYoutubeSearch, YoutubeWindowActions, IYoutubeSearchResponse } from '../../actions';
import { IAppState, IYoutubeWindowState } from '../../store';
import { BehaviorSubject, Subject, Observable, Subscription } from 'rxjs';
import { List } from 'immutable';
import { AsyncPipe } from '@angular/common';
import { YouVideoMetaData } from './youtube-adapter-scroll';
import { PlayerStateModel } from '../../services/youtube-service';

@Component({
    selector: 'youtube-window',
    providers: [AsyncPipe],
    template: `
    <youtube-embed
    [playerId]='playerId'
    [playerWindow]='playerWindow$ | async'
    (youtubeIframeInit)='onYoutubeIframeInit($event)'
    >
    </youtube-embed>
    `
})
export class YoutubeWindowComponent implements OnInit, OnDestroy {
    constructor(private ngRedux: NgRedux<IAppState>, private youtubeActions: YoutubeWindowActions) {
    }

    @Input() searchParams: BehaviorSubject<IYoutubeSearch>;
    @Input() videoIdFromScroll: Subject<string>;
    @Input() playerId: string;

    @Output() videoMetaData = new EventEmitter<List<YouVideoMetaData>>();

    playerWindow$: Observable<IYoutubeWindowState>;
    urlBuilder = (search: IYoutubeSearch) => {
        let url = 'https://www.googleapis.com/youtube/v3/search?part=id,snippet' +
            //+ "&channelId="+ this.channelID +
            '&q=' +
            search.searchTerm +
            '&type=video&order=viewCount&maxResults=' +
            search.maxResults +
            '&key=' +
            search.googleToken;

        if (search.pageToken) {
            url += '&pageToken=' + search.pageToken;
        }
        return url;
    }

    //overkill?
    dataExtractor$ = new Observable<any>((observer) => {
        try {
            observer.next(this.dataExtractorFunc);
            observer.complete();
        } catch (error) {
            observer.error(error);
        }
    });


    dataExtractorFunc = (data: any): IYoutubeSearchResponse => {
        const noNan = (x) => typeof x !== "undefined" && !!x;
        let response = {
            videoId: '',
            videoTitle: '',
            imgUrl: '',
            videos: List<any>([]),
            apiResponse: data
        } as IYoutubeSearchResponse
        let videos = data.items;
        if (noNan(videos)) {
            response.videos = List<any>(videos);
            let first = videos[0];
            if (noNan(first)) {
                if (noNan(first.id) && noNan(first.id.videoId)) {
                    response.videoId = first.id.videoId
                }
                if (noNan(first.snippet)) {
                    if (noNan(first.snippet.title)) {
                        response.videoTitle = first.snippet.title;
                    }
                    if (noNan(first.snippet.thumbnails) && noNan(first.snippet.thumbnails.high) && noNan(first.snippet.thumbnails.high.url)) {
                        response.imgUrl = first.snippet.thumbnails.high.url;
                    }
                }
            }
        }
        return response;
    }

    videoMetaDataExtractor$ = new Observable<any>((observer) => {
        try {
            observer.next(this.videoMetaDataExtractorFunc);
            observer.complete();
        } catch (error) {
            observer.error(error);
        }
    });

    videoMetaDataExtractorFunc = (videoData: any): YouVideoMetaData => {
        const noNan = (x) => typeof x !== "undefined" && !!x;
        let metaData = {};
        if (noNan(videoData)) {

            if (noNan(videoData.id) && noNan(videoData.id.videoId)) {
                Object.assign(metaData, { videoId: videoData.id.videoId });
            }
            if (noNan(videoData.snippet)) {
                if (noNan(videoData.snippet.title)) {
                    Object.assign(metaData, { title: videoData.snippet.title });
                }
                if (noNan(videoData.snippet.thumbnails) && noNan(videoData.snippet.thumbnails.high) && noNan(videoData.snippet.thumbnails.high.url)) {
                    Object.assign(metaData, { imgUrl: videoData.snippet.thumbnails.high.url });
                }
            }
            return metaData as YouVideoMetaData;
        }
        return null;
    }

    ngOnInit() {
        //bug where this is called twice if page is refreshed?
        //https://github.com/ngrx/store/issues/265
        //https://github.com/angular/angular/issues/6782
        if (this.playerWindow$ == null) {
            this.playerWindow$ = this.ngRedux.select<IYoutubeWindowState>((state) => {
                return state.youtubeWindows.playerWindows.filter((value, key) => value.playerId === this.playerId).first();
            });
            this.videoMetaDataSub = this.playerWindow$.subscribe((next) => {
                this.videoMetaData.next(next.videos.map((value, key, number) => {
                    return this.videoMetaDataExtractorFunc(value);
                }).toList());
            });
            this.searchParams.subscribe((next) => {
                this.youtubeActions.searchYoutube(this.playerId, this.urlBuilder(next), this.dataExtractor$);
            });
            this.videoIdFromScroll.subscribe((next) => {
                this.youtubeActions.pauseVideo(this.playerId);
                this.youtubeActions.changeVideo(this.playerId, next, this.videoMetaDataExtractor$);
            });
        }
    }

    playerStateChanged$: Subject<PlayerStateModel>;
    onYoutubeIframeInit(e){
        if (this.playerStateChangedSub){
            this.playerStateChangedSub.unsubscribe();
        }
        this.playerStateChanged$ = new Subject<PlayerStateModel>();
        this.playerStateChangedSub = this.youtubeActions.setupPlayerStateChangedEventListener(this.playerId, this.playerStateChanged$);
    }

    videoMetaDataSub: Subscription;
    playerStateChangedSub: Subscription;
    ngOnDestroy() {
        this.playerStateChangedSub.unsubscribe();
        this.videoMetaDataSub.unsubscribe();
    }

}