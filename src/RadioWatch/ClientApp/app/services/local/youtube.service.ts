import { Http } from '@angular/http';
import { Injectable, NgZone, Inject } from '@angular/core';
import { WindowRefService } from '../global/_addenda';

export interface IYoutubeEmbed {
    ready: boolean,
    player: any,
    playerId: any,
    videoId: string,
    videoTitle: string,
    playerHeight: "100%",
    playerWidth: "100%"
}


@Injectable()
export class YoutubeService {

    youtubeEmbeds: IYoutubeEmbed[] = [];

    //model to clone
    youtube: IYoutubeEmbed = {
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

    setupYoutubeService(playerId: string) {
        if (typeof this.windowRef.nativeWindow !== "undefined") {
            this.window = this.windowRef.nativeWindow;
            this.setupPlayer(playerId);
            this.windowDefined = true;
        }
    }

    private createPlayer(embed: IYoutubeEmbed): void {
        return new this.window.YT.Player(embed.playerId, {
            height: embed.playerHeight,
            width: embed.playerWidth,
            playerVars: {
                rel: 0,
                showinfo: 0
            }
        });
    }

    private loadPlayer(playerId: string): void {
        const embed = this.getEmbedByPlayerId(playerId);
        if (embed.player) {
            embed.player.destroy();
        }
        embed.player = this.createPlayer(embed);
        embed.ready = true;
    }

    //https://github.com/hughred22/Ionic2-Angular2-YouTube-Channel-App
    setupPlayer(embedOnId: string) {
        console.log("Running Setup Player");
        this.window['onYouTubeIframeAPIReady'] = () => {
            if (this.window['YT']) {
                console.log('Youtube API is ready');
                this.bindPlayer(embedOnId);
                this.loadPlayer(embedOnId);
            }
        };
        if (this.window.YT && this.window.YT.Player) {
            console.log('Youtube API is ready');
            this.bindPlayer(embedOnId);
            this.loadPlayer(embedOnId);
        }
    }

    launchPlayer(playerId: string, id, title): void {
        const embed = this.getEmbedByPlayerId(playerId);
        embed.player.loadVideoById(id);
        embed.videoId = id;
        embed.videoTitle = title;
    }
    
    private bindPlayer(elementId): void {
        let freshEmbed = Object.assign({}, this.youtube);
        freshEmbed.playerId = elementId;
        this.youtubeEmbeds.push(freshEmbed);
        console.log(this.youtubeEmbeds);
    };

    playerReady(playerId: string): boolean {
        let embed: IYoutubeEmbed = null;
        try {
            embed = this.getEmbedByPlayerId(playerId);
        } catch (e) {}
        if (embed)
            return true;
        return false;
    }

    purgePlayers(): void {
        this.youtubeEmbeds = [];
    }

    private getEmbedByPlayerId(playerId: string) {
        const embed = this.youtubeEmbeds.find((x) => x.playerId === playerId);
        if (typeof embed === "undefined" || !embed) {
            this.throwError(`Cannot locate id with Id:${playerId}`);
        }
        return embed;
    }

    private throwError(message: string) {
        const error = new Error(message);
        console.error(error);
        throw error;
    }
}