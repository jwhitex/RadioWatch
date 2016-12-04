import { Injectable } from '@angular/core';
import { IAppState } from '../store';
import { NgRedux } from 'ng2-redux';
import { List } from 'immutable';
import { ApiService } from '../services'
import { Observable, Subscription, Subject } from 'rxjs';

export const APP_CONFIG_ACTIONS = {
    YOUTUBE_TOKEN_RECEIVED: "YOUTUBE_TOKEN_RECEIVED",
    YOUTUBE_TOKEN_NOT_RECEIVED: "YOUTUBE_TOKEN_NOT_RECEIVED"
}

@Injectable()
export class AppConfigActions {
    constructor(private ngRedux: NgRedux<IAppState>, private api: ApiService) {
    }

    getYoutubeApiToken() {
        this.api.get('/api/config/youtube')
            .do(data => {
                this.ngRedux.dispatch({
                    type: APP_CONFIG_ACTIONS.YOUTUBE_TOKEN_RECEIVED,
                    payload: {
                        token: data.token
                    }
                });
            })
            .catch((err) => {
                console.log(err);
                return this.ngRedux.dispatch({
                    type: APP_CONFIG_ACTIONS.YOUTUBE_TOKEN_NOT_RECEIVED
                });
            }).subscribe();
    }
}