import { Http } from '@angular/http';
import { Injectable, NgZone, Inject } from '@angular/core';
import { WindowRefService } from '../services/_addenda';

@Injectable()
export class YoutubeService {
    youtube: any = {
        ready: false,
        player: null,
        playerId: null,
        videoId: null,
        videoTitle: null,
        playerHeight: '100%',
        playerWidth: '100%'
    }

    window: any;
    windowDefined = false;

    constructor(public windowRef: WindowRefService) {
        //Don't reference global objects in constructors!
        //this.setupYoutubeService();
    }

    setupYoutubeService() {
        if (typeof this.windowRef.nativeWindow !== "undefined") {
            this.window = this.windowRef.nativeWindow;
            this.setupPlayer();
            this.windowDefined = true;
        }
    }

    bindPlayer(elementId): void {
        this.youtube.playerId = elementId;
    };

    createPlayer(): void {
        return new this.window.YT.Player(this.youtube.playerId, {
            height: this.youtube.playerHeight,
            width: this.youtube.playerWidth,
            playerVars: {
                rel: 0,
                showinfo: 0
            }
        });
    }

    loadPlayer(): void {
        if (this.youtube.ready && this.youtube.playerId) {
            if (this.youtube.player) {
                this.youtube.player.destroy();
            }
            this.youtube.player = this.createPlayer();
        }
    }

    setupPlayer() {
        console.log("Running Setup Player");
        this.window['onYouTubeIframeAPIReady'] = () => {
            if (this.window['YT']) {
                console.log('Youtube API is ready');
                this.youtube.ready = true;
                this.bindPlayer('placeholder');
                this.loadPlayer();
            }
        };
        if (this.window.YT && this.window.YT.Player) {
            console.log('Youtube API is ready');
            this.youtube.ready = true;
            this.bindPlayer('placeholder');
            this.loadPlayer();
        }
    }

    launchPlayer(id, title): void {
        this.youtube.player.loadVideoById(id);
        this.youtube.videoId = id;
        this.youtube.videoTitle = title;
        return this.youtube;
    }
}