import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { IYoutubeSearch, YoutubeWindowActions, IYoutubeSearchResponse } from '../../actions';
import { IAppState, IYoutubeWindowState } from '../../store';
import { BehaviorSubject, Observable } from 'rxjs';
import { List } from 'immutable';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'youtube-window',
    providers: [AsyncPipe],
    template: `
    <youtube-embed
    [playerId]='playerId'
    [playerWindow]='playerWindow$ | async'
    >
    </youtube-embed>
    `
})
export class YoutubeWindowComponent implements OnInit, OnDestroy {
    constructor(private ngRedux: NgRedux<IAppState>, private youtubeActions: YoutubeWindowActions) { }

    @Input() searchParams: BehaviorSubject<IYoutubeSearch>;
    @Input() playerId: string;
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

    ngOnInit() {
        debugger;
        this.youtubeActions.addYoutubeWindow(this.playerId);
        this.playerWindow$ = this.ngRedux.select<IYoutubeWindowState>((state) => {
            return state.youtubeWindows.playerWindows.filter((value, key) => value.playerId === this.playerId).first();
        });
    }

    ngAfterViewInit() {
        this.searchParams.subscribe((next) => {
            this.youtubeActions.searchYoutube(this.playerId, this.urlBuilder(next), this.dataExtractor$);
        });
    }

    ngOnDestroy() {
        this.youtubeActions.removeYoutubeWindow(this.playerId);
    }
}