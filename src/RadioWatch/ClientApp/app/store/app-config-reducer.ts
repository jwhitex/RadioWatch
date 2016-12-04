import { APP_CONFIG_ACTIONS } from '../actions/app-config-actions';
import { tassign } from 'tassign';

export interface IAppConfigState {
    youtubeApiToken: string;
}

const INIT_STATE_APP_CONFIG = {
    youtubeApiToken: ''
}

export function appConfigReducer(state = INIT_STATE_APP_CONFIG, action): IAppConfigState {
    const ap = action.payload;
    switch (action.type) {
        case APP_CONFIG_ACTIONS.YOUTUBE_TOKEN_RECEIVED:
            return tassign(state, {
                youtubeApiToken: ap.token
            });
        case APP_CONFIG_ACTIONS.YOUTUBE_TOKEN_NOT_RECEIVED:
        default:
            return state
    }
}