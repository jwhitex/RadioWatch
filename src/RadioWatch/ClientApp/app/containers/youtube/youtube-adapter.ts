import { Component, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IYoutubeSearch, YoutubeWindowActions } from '../../actions';

@Component({
    selector: 'youtube-adapter',
    providers: [YoutubeWindowActions],
    template: `
    <youtube-window
    [searchParams]='searchTerm$'
    [playerId]='playerId'
    >
    </youtube-window>
    `
})
export class YoutubeAdapterComponent implements OnDestroy {

    searchTerm$: BehaviorSubject<IYoutubeSearch>;
    sub: any;
    constructor(private youtubeActions: YoutubeWindowActions) {
        let search = () => {
            return {
                searchTerm: this.searchTerm,
                pageToken: null,
                googleToken: 'AIzaSyBefQBMHX7xaIOKDLxCi4cG0XT_BJFSuJA',
                maxResults: 1
            } as IYoutubeSearch;
        }
        this.searchTerm$ = new BehaviorSubject(search());

        let min = 1000;
        let max = 100000
        const val = Math.floor(Math.random() * (max - min)) + min;
        this.playerId = `youtubePlayerIdGen_${val}`;
        this.youtubeActions.addYoutubeWindow(this.playerId);
    }
    @Input() playerId: string;
    @Input() searchTerm: string = "rick and morty everyone dies";

    ngOnDestroy(){
        this.youtubeActions.removeYoutubeWindow(this.playerId);
    }
}