import { Injectable } from '@angular/core';
import { ApiService } from '../services/_addenda';
import { Store, StoreHelper } from '../stores/_addenda';
import {
    IPhnxGridState,
    IPhnxGridRequestState,
    IPhnxGridResponseState
} from '../interfaces/_addenda';
import 'rxjs/Rx';

//remove later
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class PhalanxGridService {

    id: string;
    path: string;
    local = true;

    constructor(private apiService: ApiService, private storeHelper: StoreHelper, private store: Store) {
        
    }

    setState(state: any) {
        console.log("setting state", state);
        this.storeHelper.findAndUpdate('phalanxGrid', Object.assign({ id: this.id }, state));
    }

    initialize(identifier: string, gridState: IPhnxGridState) {
        this.id = gridState.id;
        this.storeHelper.add(identifier, gridState);
    }

    getData(page: number): Observable<any> {
        const state = this.store.getState();
        const pageSize = state["phalanxGrid"].find(x => x.id === this.id).pageSize as number;
        if (pageSize === 0)
            return Observable.empty();
        const dataEx: IPhnxGridRequestState = {
            page: page,
            pageSize: pageSize,
            sort: null,
            by: null
        };
        console.log("call to api");

        //testing
        //return this.getDataStatic(dataEx);
        if (this.local) {
            return this.getDataLocalApi(dataEx);
        } else {
            return this.getDataExternalApi(dataEx);
        }      
    }

    private getDataLocalApi(request: IPhnxGridRequestState) {
        let pathlocal = this.path + `?page=${request.page}&pageSize=${request.pageSize}`;
        return this.apiService.get(pathlocal)
            .do(res => this.setState({ data: res.data, totalRows: res.total, currentPage: request.page }));
    }

    private getDataExternalApi(request: IPhnxGridRequestState) {
        return this.apiService.getExternal(this.path)
            .do(res => {
                
                let data: any[] = res.playlist[0].playlist;
                let total = data.length;
                var skip = request.pageSize * (request.page);
                var pageData = data.slice(skip, skip + request.pageSize);
                this.setState({ data: pageData, totalRows: total, currentPage: request.page });
            });
    }

    private getDataStatic(request: IPhnxGridRequestState) {
        return this.getDataMock(request)
            .do(res => this.setState({ data: res.data, totalRows: res.total, currentPage: request.page }))
            .subscribe();
    }

    changePage(page: number) {
        return this.getData(page);
    }

    removeRow(row, page: number) {
        return this.getData(page);
    }

    purgeGridFromStore() {
        this.storeHelper.findAndDelete("phalanxGrid", this.id);
    }

    //add sort..
    getDataMock(request: IPhnxGridRequestState): Observable<IPhnxGridResponseState> {
        return Observable.create(observer => {

            var array = [
                { key: "1", artist: "dirtyartist", song: "dirtyTrack", timeplayed: "time" },
                { key: "2", artist: "stankyartist", song: "stankyTrack", timeplayed: "timewise" },
                { key: "3", artist: "stankyartist", song: "stankyTrack", timeplayed: "timewise" },
                { key: "4", artist: "stankyartist", song: "stankyTrack", timeplayed: "timewise" },
                { key: "5", artist: "stankyartist", song: "stankyTrack", timeplayed: "timewise" },
                { key: "6", artist: "stankyartist", song: "stankyTrack", timeplayed: "timewise" },
                { key: "7", artist: "stankyartist", song: "stankyTrack", timeplayed: "timewise" },
            ];

            var skip = request.pageSize * (request.page);
            var pageData = array.slice(skip, skip + request.pageSize);
            var total = array.length;

            observer.next({ data: pageData, total: total } as IPhnxGridResponseState);
            observer.complete();
        });
    }
}


