import { Component, AfterViewInit, Input } from '@angular/core';
import { YoutubeService } from '../local_services/_addenda';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
    selector: 'youtube',
    template: require('./youtube.component.html'),
    styles: [require('./youtube.component.css')],
    providers: [ YoutubeService ]
})
export class YoutubeComponent implements AfterViewInit {

    @Input() searchTerm: string;
    //channelID: string = '';
    maxResults: string = '1';
    pageToken: string;
    googleToken: string = '';
    searchQuery: string = 'rick and morty everyone dies';
    searchResults: any = [];
    onPlaying: boolean = false;
    //, public nav: NavController
    constructor(public http: Http, public ytPlayer: YoutubeService) {
        this.loadSettings();
    }

    currentlyLoaded: any;
    currentlyLoadedImg: string;
    currentlyLoadedTitle: string;
    
    launchYTPlayer(id, title): void {
        this.ytPlayer.launchPlayer(id, title);
    }

    fetchData(): void {

        let url = 'https://www.googleapis.com/youtube/v3/search?part=id,snippet' +
            //+ "&channelId="+ this.channelID +
            '&q=' +
            this.searchQuery +
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
                //https://github.com/hughred22/Ionic2-Angular2-YouTube-Channel-App
                // *** Get individual video data like comments, likes and viewCount. Enable this if you want it.
                // let newArray = data.items.map((entry) => {
                //   let videoUrl = 'https://www.googleapis.com/youtube/v3/videos?part=id,snippet,contentDetails,statistics&id=' + entry.id.videoId + '&key=' + this.googleToken;
                //   this.http.get(videoUrl).map(videoRes => videoRes.json()).subscribe(videoData => {
                //     console.log (videoData);
                //     this.posts = this.posts.concat(videoData.items);
                //     return entry.extra = videoData.items;
                //   });
                // });
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
        console.log(e);
        this.onPlaying = true;
        this.ytPlayer.launchPlayer({videoId: this.currentlyLoaded.id.videoId }, this.currentlyLoadedTitle);
    }

    loadSettings(): void {
        this.fetchData();
    }

    openSettings(): void {
        console.log("TODO: Implement openSettings()");
    }

    playVideo(e, post): void {
        console.log(post);
        this.onPlaying = true;
        this.ytPlayer.launchPlayer({ videoId: post.id.videoId }, post.snippet.title);
    }

    loadMore(): void {
        console.log("TODO: Implement loadMore()");
    }

    ngAfterViewInit(): void {
        if (!this.ytPlayer.windowDefined) {
            this.ytPlayer.setupYoutubeService();
        }
    }
}
