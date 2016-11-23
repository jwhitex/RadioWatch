import { Http } from '@angular/http';
import { Injectable, NgZone, Inject } from '@angular/core';
import { WindowRefService } from './window-ref.service';
import { DocumentRefService } from './document-ref.service';

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
            console.log("youtube scripts loaded");
        }
    }

    canSetup() {
        if (typeof this.windowRef.nativeWindow !== "undefined") {
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

    //https://github.com/hughred22/Ionic2-Angular2-YouTube-Channel-App
    setupPlayer(playerElementId: string) {
        console.log("Running Setup Player");
        this.window['onYouTubeIframeAPIReady'] = () => {
            if (this.window['YT']) {
                console.log('Youtube API is ready');
                return;
            }
        };
        if (this.window.YT && this.window.YT.Player) {
            console.log('Youtube API is ready');
            return;
        }
    }

    launchPlayer(videoId: any, player): void {
        player.loadVideoById(videoId);
    }

    private throwError(message: string) {
        const error = new Error(message);
        console.error(error);
        throw error;
    }
}