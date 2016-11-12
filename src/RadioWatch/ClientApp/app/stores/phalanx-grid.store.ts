import { Store, State, StoreHelper } from './store';
import { IPhnxGrid } from '../interfaces/_addenda';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface IPhnxGridState extends State {
    phalanxGrid: IPhnxGrid[];
}

@Injectable()
export class PhalanxGridStore extends Store {
    constructor() {
        const state: IPhnxGridState = {
            user: {},
            phalanxGrid: []
        }
        super(state, new BehaviorSubject<IPhnxGridState>(state));
    }
}

@Injectable()
export class PhalanxGridStoreHelper extends StoreHelper {
    constructor(store: PhalanxGridStore) {
        super(store);
    }
}