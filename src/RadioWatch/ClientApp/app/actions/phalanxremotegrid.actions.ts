import { Injectable } from '@angular/core';
import { IAppState } from '../store';
import { NgRedux } from 'ng2-redux';
import { List } from 'immutable';
import { ApiService } from '../services'
import { Observable } from 'rxjs';

export const PHX_REMOTE_GRID_ACTIONS = {
    PHX_REMOTE_GRID_INITIALIZE_PENDING: 'PHX_REMOTE_GRID_INITIALIZE_PENDING',
    PHX_REMOTE_GRID_INITIALIZE_SUCCESS: 'PHX_REMOTE_GRID_INITIALIZE_SUCCESS',
    PHX_REMOTE_GRID_INITIALIZE_ERROR: 'PHX_REMOTE_GRID_INITIALIZE_ERROR',
    PHX_REMOTE_GRID_READ_PENDING: 'PHX_REMOTE_GRID_READ_PENDING',
    PHX_REMOTE_GRID_READ_SUCCESS: 'PHX_REMOTE_GRID_READ_SUCCESS',
    PHX_REMOTE_GRID_READ_ERROR: 'PHX_REMOTE_GRID_READ_ERROR',
    PHX_REMOTE_GRID_SORT_PENDING: 'PHX_REMOTE_GRID_SORT_PENDING',
    PHX_REMOTE_GRID_SORT_SUCCESS: 'PHX_REMOTE_GRID_SORT_SUCCESS',
    PHX_REMOTE_GRID_PAGE_CHANGE_PENDING: 'PHX_REMOTE_GRID_PAGE_CHANGE_PENDING',
    PHX_REMOTE_GRID_PAGE_CHANGE_SUCCESS: 'PHX_REMOTE_GRID_PAGE_CHANGE_SUCCESS',
    PHX_REMOTE_GRID_UI_PAGINATION_UPDATED: 'PHX_REMOTE_GRID_UI_PAGINATION_UPDATED',
    PHX_REMOTE_GRID_ROW_EXPANDED: 'PHX_REMOTE_GRID_ROW_EXPANDED',
    PHX_REMOTE_GRID_ROW_COLLAPSED: 'PHX_REMOTE_GRID_ROW_COLLAPSED',
    PHX_REMOTE_GRID_STORE_EXTRA_DATA: 'PHX_REMOTE_GRID_STORE_EXTRA_DATA'
}

export interface GridDataSourceBuilder {
    (object?: any): string;
}


@Injectable()
export class PhxRmtGridActions {
    constructor(private ngRedux: NgRedux<IAppState>, private api: ApiService) {
    }

    phxGridInitialize(init: IPhxRmtGridInit) {
        this.ngRedux.dispatch({
            type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_INITIALIZE_PENDING,
            payload: init
        });

        this.ngRedux.dispatch({
            type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_INITIALIZE_SUCCESS
        });
    }

    phxGridStoreExtraData(extraData: any){
        if (extraData !== undefined && extraData && JSON.stringify(extraData) !== '{}')
        this.ngRedux.dispatch({
            type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_STORE_EXTRA_DATA,
            payload: extraData
        })
    }

    phxGridRead(request: IPhxRmtGridRequest, dataExtractionDevice: Observable<any>) {
        this.ngRedux.dispatch({
            type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_READ_PENDING,
            payload: Object.assign({},request, {action:'SEARCHING'} ) 
        });

        //todo: optimize calls..
        //let callRequired = this.isApiCallRequired(request.dataSource);
        this.api.getExternal(request.dataSource)
            .do(res => {
                let [gData, totalR] = [[], 0];
                const subscription = dataExtractionDevice.subscribe((next) => {
                    [gData, totalR] = next(res);
                }, (err) => {
                    console.log(err);
                }, () => { });
                subscription.unsubscribe();
                this.ngRedux.dispatch({
                    type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_READ_SUCCESS,
                    payload: {
                        response: res,
                        data: gData,
                        total: totalR,
                        action: totalR === 0 ? 'NO_RESULTS' : 'RESULTS_VALID'
                    }
                });
            })
            .do(() =>
                this.ngRedux.dispatch({
                    type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_PAGE_CHANGE_SUCCESS,
                    payload: this.phxGridApplyPagingOnData()
                }))
            .do(() =>
                this.phxGridUpdatePagination())
            .catch(() =>
                this.ngRedux.dispatch({
                    type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_READ_ERROR,
                    payload: {
                        action: 'SEARCH_ERROR'
                    }
                }))
            .subscribe();
    }

    phxGridSort(descriptor: IPhxRmtGridSortDescriptor) {
        this.ngRedux.dispatch({
            type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_SORT_PENDING,
            payload: descriptor
        });

        this.ngRedux.dispatch({
            type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_SORT_SUCCESS,
            payload: this.phxGridApplySortingOnData()
        });
    }

    phxGridPageChange(page: number) {
        this.ngRedux.dispatch({
            type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_PAGE_CHANGE_PENDING,
            payload: {
                page: page
            }
        });
        this.ngRedux.dispatch({
            type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_PAGE_CHANGE_SUCCESS,
            payload: this.phxGridApplyPagingOnData()
        });

        this.phxGridUpdatePagination();
    }

    expandRow(rowInfo: any) {
        this.ngRedux.dispatch({
            type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_ROW_EXPANDED,
            payload: {
                key: rowInfo.row.key,
                atIndexInsert: rowInfo.index + 1,
            }
        });
    }

    collapseRow(rowInfo: any) {
        this.ngRedux.dispatch({
            type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_ROW_COLLAPSED,
            payload: {
                key: rowInfo.row.key,
            }
        });
    }

    private phxGridApplyPagingOnData(data?: any, state?: any): any {
        if (!data) {
            if (!state)
                state = this.ngRedux.getState();
            data = state.phxRmtGrid.data
        }
        const skip = state.phxRmtGrid.pageSize * (state.phxRmtGrid.page);
        return data.slice(skip, skip + state.phxRmtGrid.pageSize)
    }

    private phxGridApplySortingOnData(): any {
        const state = this.ngRedux.getState();
        const data = List(state.phxRmtGrid.data);
        const sort = state.phxRmtGrid.sort;
        const by = state.phxRmtGrid.by;
        const sortedData = data.sort((a, b) => {
            if (a.data[sort] > b.data[sort]) {
                return 1 * by;
            }
            if (a.data[sort] < b.data[sort]) {
                return -1 * by;
            }
            return 0;
        });
        return this.phxGridApplyPagingOnData(sortedData, state);
    }

    private phxGridUpdatePagination() {
        const state = this.ngRedux.getState();
        const total = state.phxRmtGrid.totalRows;
        const pageSize = state.phxRmtGrid.pageSize;
        const currentPage = state.phxRmtGrid.page;

        const width = this.calcPaginationWidth(total, pageSize);
        let newPages: number[] = [];
        let newPaginationButtonColors: IPhxRmtGridPagination[] = [];
        for (let i = 0; i < Math.ceil(total / pageSize); i++) {
            newPages.push(i + 1);
            if (currentPage === i)
                newPaginationButtonColors.push({ background: "#fff", character: "#337ab7" });
            newPaginationButtonColors.push({ background: "#337ab7", character: "#fff" });
        }
        this.ngRedux.dispatch({
            type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_UI_PAGINATION_UPDATED,
            payload: {
                pages: List<number>(newPages),
                paginationWidth: width,
                paginationButtonColors: List<IPhxRmtGridPagination>(newPaginationButtonColors)
            }
        })
    }

    private calcPaginationWidth(total: number, pageSize: number) {
        const totalPages: any = Math.ceil(total / pageSize) + 1;
        return ((totalPages * 80) + pageSize * 3) + "px";
    }
}

//use these in view..
export interface IPhxRmtGridInit {
    id: string;
    pageSize: number;
    allowDelete: boolean;
    allowSorting: boolean;
    initialPage: number;
    columns: List<IPhxRmtGridInitColumn>;
}

export interface IPhxRmtGridInitColumn {
    colName: string,
    dataName: string,
    sortable: boolean,
    visible: boolean,
    date_pipe: string,
}

export interface IPhxRmtGridRequest {
    dataSource: string;
    pageSize: number;
    page: number;
    sort: string;
    by: number;
}

export interface IPhxRmtGridSortDescriptor {
    sort: string;
    by: number;
}

export interface IPhxRmtGridPagination {
    background: string;
    character: string;
}