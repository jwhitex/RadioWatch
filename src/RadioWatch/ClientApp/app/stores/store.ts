import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

export interface State {
    user: Object;
}

export class Store {

    private _defaultState: State;
    private _store;
    changes: any;
    constructor(defaultState: State, behaviorSubject: BehaviorSubject<State>) {
        this._defaultState = defaultState;
        this._store = behaviorSubject;
        this.changes = this._store.asObservable()
            .distinctUntilChanged()
            .do(() => console.log('changes'));
    }
   
    setState(state: State) {
        console.log('state set ', state);
        this._store.next(state);
    }

    getState() {
        return this._store.value;
    }

    purge() {
        this._store.next(this._defaultState);
    }
}

export class StoreHelper {
    constructor(private store: Store) { }

    update(prop, state) {
        const currentState = this.store.getState();
        this.store.setState(Object.assign({}, currentState, { [prop]: state }));
    }
    add(prop, state) {
        const currentState = this.store.getState();
        const collection = currentState[prop];
        this.store.setState(Object.assign({}, currentState, { [prop]: [state, ...collection] }));
    }
    findAndUpdate(prop, state) {
        const currentState = this.store.getState();
        const collection = currentState[prop];
        this.store.setState(Object.assign({},
            currentState,
            {
                [prop]: collection.map(item => {
                    if (item.id !== state.id) {
                        return item;
                    }
                    return Object.assign({}, item, state);
                })
            }));
    }
    findAndDelete(prop, id) {
        const currentState = this.store.getState();
        const collection = currentState[prop];
        this.store.setState(Object.assign({}, currentState, { [prop]: collection.filter(item => item.id !== id) }));
    }

    findAndUpdateProp(prop, id, identitier, state) {
        const currentState = this.store.getState();
        const collection = currentState[prop];
        this.store.setState(Object.assign({},
            currentState,
            {
                [prop]: collection.map(item => {
                    if (item.id !== id) {
                        return item;
                    }
                    let newStateObject = Object.assign({}, item);
                    Object.keys(item).map(objName => {
                        if (objName === identitier) {

                            newStateObject = Object.assign({}, newStateObject, { [objName]: state });
                        }
                    });
                    return newStateObject;
                })
            }));
    }
}