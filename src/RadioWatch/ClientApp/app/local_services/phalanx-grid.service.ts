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

    getData(page: number, sort?: string, by?: number): Observable<any> {
        const state = this.store.getState();
        const pageSize = state["phalanxGrid"].find(x => x.id === this.id).pageSize as number;

        if (!sort && !by) {
            const findState = state["phalanxGrid"].find(x => x.id === this.id);
            if (typeof  findState !== "undefined" && findState) {
                sort = findState.sortBy;
                by = findState.direction;
            }
        }

        if (pageSize === 0)
            return Observable.empty();
        const dataEx: IPhnxGridRequestState = {
            page: page,
            pageSize: pageSize,
            sort: sort,
            by: by
        };
        console.log("call to api");

        if (this.local) {
            return this.getDataLocalApi(dataEx);
        } else {
            return this.getDataExternalApi(dataEx);
        }      
    }

    private getDataLocalApi(request: IPhnxGridRequestState) {
        let pathlocal = this.path + `?page=${request.page}&pageSize=${request.pageSize}`;
        if (request.sort && request.by) {
            pathlocal += `&sort=${request.sort}&by=${request.by}`;
        }
        return this.apiService.get(pathlocal)
            .do(res => this.setState({ data: res.data, totalRows: res.total, currentPage: request.page, sortBy: request.sort, direction: request.by }));
    }

    private getDataExternalApi(request: IPhnxGridRequestState) {
        return this.apiService.getExternal(this.path)
            .do(res => {
                let data: any[] = res.playlist[0].playlist;
                let total = data.length;
                var skip = request.pageSize * (request.page);

                if (request.sort && request.by) {
                    data.sort((a: any, b: any) => {
                        if (a[request.sort] > b[request.sort]) {
                            return 1 * request.by;
                        }
                        if (a[request.sort] < b[request.sort]) {
                            return -1 * request.by;
                        }
                        return 0;
                    });
                }

                var pageData = data.slice(skip, skip + request.pageSize);
                this.setState({ data: pageData, totalRows: total, currentPage: request.page, sortBy: request.sort, direction: request.by });
            });
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
   
}


