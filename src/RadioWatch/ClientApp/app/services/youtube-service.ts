import { Http } from '@angular/http';
import { Injectable, NgZone, Inject } from '@angular/core';
import { WindowRefService } from './window-ref.service';
import { DocumentRefService } from './document-ref.service';
import { Subject } from 'rxjs';

@Injectable()
export class YoutubeService {
    window: any;
    constructor(private windowRef: WindowRefService, private documentService: DocumentRefService) {
    }

    pullScripts(): void {
        if (typeof this.documentService.nativeDocument !== "undefined") {
            const source = "https://www.youtube.com/iframe_api";
            const ref = this.documentService.nativeDocument.getElementsByTagName("script");
            for (let i = 0; i < ref.length; i++) {
                const element = ref.item(i);
                if (element.src === source) {
                    return;
                }
            }
            const tag = this.documentService.nativeDocument.createElement("script");
            tag.src = source;
            const firstScriptTag = ref[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            //console.log("youtube scripts loaded");
        }
    }

    isYtDefined(): boolean {
        if (typeof this.windowRef.nativeWindow !== "undefined"
            && typeof this.windowRef.nativeWindow.YT !== "undefined"
            && typeof this.windowRef.nativeWindow.YT.Player !== "undefined") {
            this.window = this.windowRef.nativeWindow;
            return true;
        } else {
            return false;
        }
    }

    createPlayer(playerId: string, height: string, width: string): void {
        return new this.window.YT.Player(playerId, {
            height: height,
            width: width,
            playerVars: {
                rel: 0,
                showinfo: 0
            }
        });
    }

    setupPlayerStateChangedEventListener(playerId: string, player: any, playerStateChanged$: Subject<PlayerStateModel>) {
        this.window['youtubePlayerStateEventListenerFunc'] = (event) => {
            playerStateChanged$.next({
                playerId: playerId,
                statusId: event.data
            });
        };
        this.addPlayerStateEventListener('youtubePlayerStateEventListenerFunc', player);
    }

    //https://github.com/hughred22/Ionic2-Angular2-YouTube-Channel-App
    setupPlayer(playerElementId: string) {
        this.window['onYouTubeIframeAPIReady'] = () => {
            if (this.window['YT']) {
                //console.log('Youtube API is ready');
                return;
            }
        };
        if (this.window['YT'] && this.window.YT.Player) {
            //console.log('Youtube API is ready');
            return;
        }
    }

    launchPlayer(videoId: any, player): void {
        player.loadVideoById(videoId);
    }

    private addPlayerStateEventListener(listenerFuncName: string, player: any): void {
        player.addEventListener('onStateChange', listenerFuncName);
    }

    pauseVideo(player: any): void {
        player.pauseVideo();
    }

    private throwError(message: string) {
        const error = new Error(message);
        console.error(error);
        throw error;
    }
}

export interface PlayerStateModel {
    playerId: string,
    statusId: number
}

export const YOUTUBE_PLAYER_STATES = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5
}
