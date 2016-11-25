import { YOUTUBE_WINDOW_ACTIONS, YOUTUBE_WINDOWS_ACTIONS } from '../actions/youtube-window-actions';
import { List } from 'immutable';
import { tassign } from 'tassign';

export interface IYoutubeWindowsState {
    playerWindows: List<IYoutubeWindowState>;
}

export interface IYoutubeWindowState {
    playerId: string;
    player: any;
    videoId: string;
    videoTitle: string;
    imgUrl: string;
    ready: boolean;
    playing: boolean;
    playerHeight: string;
    playerWidth: string;
    videos: List<any>;
    apiResponse: Object;
}

const INIT_STATE_WINDOW = {
    playerId: null,
    player: null,
    videoId: null,
    videoTitle: null,
    imgUrl: null,
    ready: false,
    playing: false,
    playerHeight: '100%',
    playerWidth: '100%',
    videos: List<any>(),
    apiResponse: null
}

const INIT_STATE_WINDOWS = {
    playerWindows: List<IYoutubeWindowState>([])
}


export function youtubeWindowsReducer(state = INIT_STATE_WINDOWS, action): IYoutubeWindowsState {
    const ap = action.payload;
    switch (action.type) {
        case YOUTUBE_WINDOWS_ACTIONS.ADD_WINDOW:
            return tassign(state, {
                playerWindows: state.playerWindows.push(tassign(INIT_STATE_WINDOW, { playerId: ap }))
            });
        case YOUTUBE_WINDOWS_ACTIONS.REMOVE_WINDOW:
            const index = state.playerWindows.findIndex((value, key) => value.playerId === ap);
            return tassign(state, {
                playerWindows: state.playerWindows.remove(index)
            })
        case YOUTUBE_WINDOW_ACTIONS.SEARCHING_IN_PROG:
        case YOUTUBE_WINDOW_ACTIONS.SEARCHING_SUCCESS:
        case YOUTUBE_WINDOW_ACTIONS.SEARCHING_FAILED:
        case YOUTUBE_WINDOW_ACTIONS.VIDEO_STARTED:
        case YOUTUBE_WINDOW_ACTIONS.VIDEO_STOPED:
        case YOUTUBE_WINDOW_ACTIONS.PLAYER_LOADED:
            return tassign(state, {
                playerWindows: state.playerWindows.map(t => youtubeWindowReducer(t, action)).toList()
            });
        default:
            return state;
    }
}

export function youtubeWindowReducer(state = INIT_STATE_WINDOW, action): IYoutubeWindowState {
    const ap = action.payload;
    if (typeof ap === "undefined" || ap.playerId !== state.playerId){
        return state;
    }
    switch (action.type) {
        case YOUTUBE_WINDOW_ACTIONS.SEARCHING_SUCCESS:
            return tassign(state,
                {
                    playerId: ap.playerId,
                    videoId: ap.videoId,
                    videoTitle: ap.videoTitle,
                    imgUrl: ap.imgUrl,
                    videos: List<any>(ap.videos),
                    apiResponse: ap.apiResponse,
                });
        case YOUTUBE_WINDOW_ACTIONS.PLAYER_LOADED:
            return tassign(state,
                {
                    playerId: ap.playerId,
                    player: ap.player,
                    ready: ap.ready
                });
        case YOUTUBE_WINDOW_ACTIONS.VIDEO_STARTED:
        case YOUTUBE_WINDOW_ACTIONS.VIDEO_STOPED:
            return tassign(state,
                {
                    playerId: ap.playerId,
                    playing: ap.playing
                });
        case YOUTUBE_WINDOW_ACTIONS.SEARCHING_IN_PROG:
        case YOUTUBE_WINDOW_ACTIONS.SEARCHING_FAILED:
        default:
            return state;
    }
}
