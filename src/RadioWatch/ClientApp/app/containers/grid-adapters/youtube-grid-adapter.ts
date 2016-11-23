import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IYoutubeSearch } from '../../actions';

@Component({
    selector: 'youtube-grid-adapter',
    template: `
    <youtube-window
    [searchParams]='searchTerm$'
    [playerId]='playerId'
    >
    </youtube-window>
    `
})
export class YoutubeGridAdapterComponent {
    constructor() { }

    @Input() playerId: string = "wukong_bat";
    @Input() searchTerm: string = "rick and morty everyone dies";
    search = () => {
        return {
            searchTerm: this.searchTerm,
            pageToken: null,
            googleToken: 'AIzaSyBefQBMHX7xaIOKDLxCi4cG0XT_BJFSuJA',
            maxResults: 1
        } as IYoutubeSearch;
    }
    searchTerm$: BehaviorSubject<IYoutubeSearch> = new BehaviorSubject(this.search());
}