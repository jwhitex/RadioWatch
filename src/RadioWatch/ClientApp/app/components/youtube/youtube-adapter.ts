import { Component, Input, Output, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { IYoutubeSearch, YoutubeWindowActions } from '../../actions';
import { IAppConfigState } from '../../store'
import { select } from 'ng2-redux'

@Component({
    selector: 'youtube-adapter',
    providers: [YoutubeWindowActions],
    template: `
    <youtube-window
    [searchParams]='searchTerm$'
    [playerId]='playerId'
    [videoIdFromScroll]="videoId$" 
    (videoMetaData)="onVideoMetaDataChange($event)"
    >
    </youtube-window>
    `
})
export class YoutubeAdapterComponent implements OnInit, OnDestroy {
    searchTerm$: BehaviorSubject<IYoutubeSearch>;
    videoId$: Subject<string>;

    @select(['appConfig']) appConfig$: Observable<IAppConfigState>;
    appConfig: IAppConfigState;

    constructor(private youtubeActions: YoutubeWindowActions) {
        let min = 1000;
        let max = 100000
        const val = Math.floor(Math.random() * (max - min)) + min;
        this.playerId = `youtubePlayerIdGen_${val}`;
        this.youtubeActions.addYoutubeWindow(this.playerId);

        this.appConfig$.subscribe((value) => this.appConfig = value);
    }

    @Input() playerId: string;
    @Input() searchTerm: string = "rick and morty everyone dies";
    ngOnInit() {
        let search = () => {
            return {
                searchTerm: this.searchTerm,
                pageToken: null,
                googleToken: this.appConfig.youtubeApiToken,
                maxResults: 1
            } as IYoutubeSearch;
        }
        this.searchTerm$ = new BehaviorSubject(search());
        this.videoId$ = new Subject<string>();
    }
    ngOnDestroy() {
        this.youtubeActions.removeYoutubeWindow(this.playerId);
    }

    onVideoMetaDataChange(e) {
    }
}