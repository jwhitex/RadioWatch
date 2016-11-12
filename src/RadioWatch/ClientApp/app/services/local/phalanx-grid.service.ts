import { Injectable } from '@angular/core';
import { ApiService } from '../global/_addenda';
import { PhalanxGridStore, PhalanxGridStoreHelper } from '../../stores/_addenda';
import {
    IPhnxGrid,
    IPhnxGridRequestState,
    IPhnxGridResponseState
} from '../../interfaces/_addenda';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class PhalanxGridService {

    //too much outside store..
    id: string;
    path: string;
    local = true;

    constructor(private apiService: ApiService, private storeHelper: PhalanxGridStoreHelper, private store: PhalanxGridStore) {
    }

    setState(state: any) {
        console.log("setting state", state);
        this.storeHelper.findAndUpdate('phalanxGrid', Object.assign({ id: this.id }, state));
    }

    initialize(identifier: string, gridState: IPhnxGrid) {
        this.id = gridState.id;
        this.storeHelper.add(identifier, gridState);
    }

    getData(page: number, sort?: string, by?: number): Observable<any> {
        const state = this.store.getState();
        const pageSize = state["phalanxGrid"].find(x => x.id === this.id).pageSize as number;

        if (!sort && !by) {
            const findState = state["phalanxGrid"].find(x => x.id === this.id);
            if (typeof findState !== "undefined" && findState) {
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

    //this no suitable for library code...
    private getDataExternalApi(request: IPhnxGridRequestState) {
        return this.apiService.getExternal(this.path)
            .do(res => {
                let data: any[] = res.playlist[0];
                if (typeof data !== "undefined" && data) {
                    //this is the case with no search..
                    const playlistData = data["playlist"];
                    if (typeof playlistData !== "undefined" && playlistData) {
                        const total = playlistData.length;
                        const skip = request.pageSize * (request.page);
                        if (request.sort && request.by) {
                            this.sortArray(playlistData, request.sort, request.by);
                        }
                        const pageData = playlistData.slice(skip, skip + request.pageSize);
                        this.setState({ data: pageData, totalRows: total, currentPage: request.page, sortBy: request.sort, direction: request.by });
                    } else {
                        data = res.playlist;
                        const total = data.length;
                        const skip = request.pageSize * (request.page);

                        if (request.sort && request.by) {
                            this.sortArray(data, request.sort, request.by);
                        }
                        const pageData = data.slice(skip, skip + request.pageSize);
                        this.setState({ data: pageData, totalRows: total, currentPage: request.page, sortBy: request.sort, direction: request.by });
                    }
                }
            });
    }

    sortArray(data: any[], sort: string, by: number) {
        data.sort((a: any, b: any) => {
            if (a[sort] > b[sort]) {
                return 1 * by;
            }
            if (a[sort] < b[sort]) {
                return -1 * by;
            }
            return 0;
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


