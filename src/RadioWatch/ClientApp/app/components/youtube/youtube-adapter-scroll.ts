import { Component, Input, Output, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { IYoutubeSearch, YoutubeWindowActions } from '../../actions';
import { IAppState, IYoutubeWindowState } from '../../store';
import { List } from 'immutable';
import { NgRedux } from 'ng2-redux';

@Component({
    selector: 'youtube-adapter-scroll',
    providers: [YoutubeWindowActions],
    templateUrl: './youtube-adapter-scroll.html',
    styleUrls: ['./youtube-adapter-scroll.css']
})
export class YoutubeAdapterScrollComponent implements OnInit, OnDestroy {
    searchTerm$: BehaviorSubject<IYoutubeSearch>;
    videoId$: Subject<string>;

    //todo: also resolving this in child component?
    playerWindowReady$: Observable<boolean>;

    constructor(private youtubeActions: YoutubeWindowActions, private ngRedux: NgRedux<IAppState>) {
        let min = 1000;
        let max = 100000
        const val = Math.floor(Math.random() * (max - min)) + min;
        this.playerId = `youtubePlayerIdGen_${val}`;
        this.youtubeActions.addYoutubeWindow(this.playerId);
    }

    @Input() playerId: string;
    @Input() searchTerm: string = "rick and morty everyone dies";

    ngOnInit() {
        let search = () => {
            return {
                searchTerm: this.searchTerm,
                pageToken: null,
                googleToken: 'AIzaSyBefQBMHX7xaIOKDLxCi4cG0XT_BJFSuJA',
                maxResults: 10
            } as IYoutubeSearch;
        }
        this.searchTerm$ = new BehaviorSubject(search());
        this.videoId$ = new Subject<string>();
        this.playerWindowReady$ = this.ngRedux.select<boolean>((state) => {
            const window = state.youtubeWindows.playerWindows.find((value, key) => value.playerId === this.playerId);
            if (!window){
                return false;
            }
            return window.ready;
        });
    }
    ngOnDestroy() {
        this.youtubeActions.removeYoutubeWindow(this.playerId);
    }

    wheel(event: MouseWheelEvent) {
        event.preventDefault();
        if (event.deltaY < 0) {
            if (this.centerKv.index <= 0) {
                this.setImages(0);
                return;
            }
            this.setImages(this.centerKv.index - 1);
        } else if (event.deltaY > 0) {
            const lastIndex = this.videoMetaData.size - 1;

            if (this.centerKv.index >= lastIndex) {
                this.setImages(lastIndex);
                return;
            }
            this.setImages(this.centerKv.index + 1);
        }
    }

    setImages(seed: number) {
        if (seed <= 0) {
            this.leftKv = new YouVideoMetaDataWithIndex();
        } else {
            const leftMeta = this.videoMetaData.get(seed - 1);
            this.leftKv = {
                index: seed - 1,
                value: leftMeta.imgUrl,
                title: leftMeta.title,
                id: leftMeta.videoId
            };
        }
        const centerMeta = this.videoMetaData.get(seed);
        if (centerMeta.videoId !== this.centerKv.id) {
            this.videoId$.next(centerMeta.videoId);
        }
        this.centerKv = {
            index: seed,
            value: centerMeta.imgUrl,
            title: centerMeta.title,
            id: centerMeta.videoId
        };
        if (seed >= this.videoMetaData.size - 1) {
            this.rightKv = new YouVideoMetaDataWithIndex();
        } else {
            const rightMeta = this.videoMetaData.get(seed + 1);
            this.rightKv = {
                index: seed + 1,
                value: rightMeta.imgUrl,
                title: rightMeta.title,
                id: rightMeta.videoId
            }
        }
    }

    leftKv = new YouVideoMetaDataWithIndex();
    centerKv = new YouVideoMetaDataWithIndex();
    rightKv = new YouVideoMetaDataWithIndex();
    videoMetaData: List<YouVideoMetaData>;

    onVideoMetaDataChange(metaData: List<YouVideoMetaData>) {
        if (this.centerKv.value)
            return;

        this.videoMetaData = metaData;
        const atZero = this.videoMetaData.get(0);
        if (atZero !== undefined) {
            this.centerKv = {
                index: 0,
                value: atZero.imgUrl,
                title: atZero.title,
                id: atZero.videoId
            };
            const atOne = this.videoMetaData.get(1);
            this.rightKv = {
                index: 1,
                value: atOne.imgUrl,
                title: atOne.title,
                id: atOne.videoId
            };
        }
    }
}

class YouVideoMetaDataWithIndex {
    index: number;
    value: string;
    title: string;
    id: string;
}

export interface YouVideoMetaData {
    title: string;
    imgUrl: string;
    videoId: string;
}
