import { Injectable } from '@angular/core';
import { IAppState } from '../store';
import { NgRedux } from 'ng2-redux';
import { List } from 'immutable';
import { ApiService } from '../services/global/_addenda'
import { Observable } from 'rxjs';
import { YoutubeService } from '../services';

export const YOUTUBE_WINDOW_ACTIONS = {
    SEARCHING_IN_PROG: "SEARCHING_IN_PROG",
    SEARCHING_SUCCESS: "SEARCHING_SUCCESS",
    SEARCHING_FAILED: "SEARCHING_FAILED",
    VIDEO_STARTED: "VIDEO_STARTED",
    VIDEO_STOPED: "VIDEO_STOPED",
    PLAYER_LOADED: "PLAYER_LOADED"
}

export const YOUTUBE_WINDOWS_ACTIONS = {
    ADD_WINDOW: "ADD_WINDOW",
    REMOVE_WINDOW: "REMOVE_WINDOW"
}


@Injectable()
export class YoutubeWindowActions {
    constructor(private ngRedux: NgRedux<IAppState>, private api: ApiService, private ytService: YoutubeService) {
    }

    addYoutubeWindow(playerId: string){
        this.ngRedux.dispatch({
            type: YOUTUBE_WINDOWS_ACTIONS.ADD_WINDOW,
            payload: playerId                        
        });
    }

    removeYoutubeWindow(playerId: string){
        this.ngRedux.dispatch({
            type: YOUTUBE_WINDOWS_ACTIONS.REMOVE_WINDOW,
            payload: playerId                        
        });
    }

    searchYoutube(playerId: string, url: string, dataExtractor: Observable<any>) {
        this.ngRedux.dispatch({
            type: YOUTUBE_WINDOW_ACTIONS.SEARCHING_IN_PROG,
        });
        this.api.getExternal(url).do(data => {
            let videoData: IYoutubeSearchResponse = null; //maybe youtube video?
            const sub = dataExtractor.subscribe((next) => {
                videoData = next(data);
            }, (err) => {
                console.log(err);
            }, () => { });
            sub.unsubscribe();
            this.ngRedux.dispatch({
                type: YOUTUBE_WINDOW_ACTIONS.SEARCHING_SUCCESS,
                payload: {
                    playerId: playerId,
                    videoId: videoData.videoId,
                    videoTitle: videoData.videoTitle,
                    imgUrl: videoData.imgUrl,
                    videos: videoData.videos,
                    apiResponse: videoData.apiResponse,  
                }
            });
        }).catch(() =>
            this.ngRedux.dispatch({
                type: YOUTUBE_WINDOW_ACTIONS.SEARCHING_FAILED
            })).subscribe();
    }

    initYoutubeWindow(playerId: string) {
        if (this.ytService.canSetup()){
            this.loadPlayer(playerId);
        }
    }

    private loadPlayer(playerId: string){
        this.ytService.setupPlayer(playerId);
        const playerWindow = this.windowById(playerId);
        if (playerWindow.player) {
            playerWindow.player.destroy();
        }     
        let newPlayer = this.ytService.createPlayer(playerWindow.playerId, playerWindow.playerHeight, playerWindow.playerWidth);
        this.ngRedux.dispatch({
            type: YOUTUBE_WINDOW_ACTIONS.PLAYER_LOADED,
            payload: {
                playerId: playerId,
                player: newPlayer,
                ready: true
            }
        })
    }

    startVideo(playerId: string) {
        const window = this.windowById(playerId);
        this.ytService.launchPlayer(window.videoId, window.player);
        this.ngRedux.dispatch({
            type: YOUTUBE_WINDOW_ACTIONS.VIDEO_STARTED,
            payload: {
                playerId: playerId,
                playing: true
            }
        });
    }

    stopVideo(playerId: string) {
        const window = this.windowById(playerId);
        this.ngRedux.dispatch({
            type: YOUTUBE_WINDOW_ACTIONS.VIDEO_STOPED,
            payload: {
                playerId: playerId,
                playing: false
            }
        });
    }

    private windowById(playerId: string) {
        const state = this.ngRedux.getState();
        const playerWindow = state.youtubeWindows.playerWindows.filter((value,key) => value.playerId === playerId).first();
        if (typeof playerWindow === "undefined" || !playerWindow){
            console.log("NO PLAYER WINDOW..")
        } else {
            return playerWindow;
        }
    }

}

export interface IYoutubeSearch{
    pageToken: string;
    googleToken: string;
    searchTerm: string;
    maxResults: number;
}

export interface IYoutubeSearchResponse {
    videoId: string;
    videoTitle: string;
    imgUrl: string;
    videos: List<any>;
    apiResponse: Object;
}