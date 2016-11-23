import { Component, AfterViewInit, OnInit, Input } from '@angular/core';
import { YoutubeOldService } from '../services/local/_addenda';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
    selector: 'youtube',
    template: require('./youtube.component.html'),
    styles: [require('./youtube.component.css')],
    providers: [YoutubeOldService]
})
export class YoutubeComponent implements OnInit, AfterViewInit {

    @Input() playerId: string = "youtube_embed_placeholder";
    @Input() searchTerm: string = "rick and morty everyone dies";
    maxResults: string = '1';
    pageToken: string;
    googleToken: string = '';
    searchResults: any = [];
    onPlaying: boolean = false;
    constructor(public http: Http, public ytPlayer: YoutubeOldService) {
    }

    currentlyLoaded: any;
    currentlyLoadedImg: string;
    currentlyLoadedTitle: string;



    fetchData(): void {

        let url = 'https://www.googleapis.com/youtube/v3/search?part=id,snippet' +
            //+ "&channelId="+ this.channelID +
            '&q=' +
            this.searchTerm +
            '&type=video&order=viewCount&maxResults=' +
            this.maxResults +
            '&key=' +
            this.googleToken;

        if (this.pageToken) {
            url += '&pageToken=' + this.pageToken;
        }

        this.http.get(url)
            .map(res => res.json())
            .subscribe(data => {
                console.log(data.items);
                this.searchResults = this.searchResults.concat(data.items);
                this.stageVideo(data.items[0]);
            });
    }

    stageVideo(videoMeta: any): void {
        this.currentlyLoaded = videoMeta;
        this.currentlyLoadedImg = videoMeta.snippet.thumbnails.high.url;
        this.currentlyLoadedTitle = videoMeta.snippet.title;
    }

    loadStagedVideo(e) {
        if (this.ytPlayer.playerReady(this.playerId)) {
            this.onPlaying = true;
            this.ytPlayer.launchPlayer(this.playerId, { videoId: this.currentlyLoaded.id.videoId }, this.currentlyLoadedTitle);
        }
    }

    playVideo(e, post): void {
        console.log(post);
        if (this.ytPlayer.playerReady(this.playerId)) {
            this.onPlaying = true;
            this.ytPlayer.launchPlayer(this.playerId, { videoId: post.id.videoId }, post.snippet.title);
        }
    }

    openSettings(): void {
        console.log("TODO: Implement openSettings()");
    }
    loadMore(): void {
        console.log("TODO: Implement loadMore()");
    }

    ngAfterViewInit(): void {
        this.ytPlayer.setupYoutubeService(this.playerId);
        this.fetchData();
    }

    ngOnInit(): void {
        
    }
}
