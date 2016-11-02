import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { IPhnxGridState } from '../interfaces/phalanx-grid.model';

export interface Note {
    color: string,
    title: string,
    value: string,
    id?: string | number,
    createdAt?: string,
    updatedAt?: string,
    userId?: string
}

export interface State {
    notes: Note[];
    user: Object;
    phalanxGrid: IPhnxGridState[];
}

const defaultState: State = {
    notes: [],
    user: {},
    phalanxGrid:[]
};

const _store = new BehaviorSubject<State>(defaultState);

@Injectable()
export class Store {
    private _store = _store;
    //creates an 'observable' that can be subscribed to!
    changes = this._store.asObservable()
        .distinctUntilChanged()
        .do(() => console.log('changes'));

    setState(state: State) {
        console.log('state set ', state);
        this._store.next(state);
    }

    getState() {
        return _store.value;
    }

    purge() {
        this._store.next(defaultState);
    }
}