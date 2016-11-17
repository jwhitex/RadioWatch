import { Injectable } from '@angular/core';
import { IAppState } from '../store';
import { NgRedux } from 'ng2-redux';
import { List } from 'immutable';
import { ApiService } from '../services/global/_addenda'

export const PHX_REMOTE_GRID_ACTIONS = {
    PHX_REMOTE_GRID_INITIALIZE_PENDING: 'PHX_REMOTE_GRID_INITIALIZE_PENDING',
    PHX_REMOTE_GRID_INITIALIZE_SUCCESS: 'PHX_REMOTE_GRID_INITIALIZE_SUCCESS',
    PHX_REMOTE_GRID_INITIALIZE_ERROR: 'PHX_REMOTE_GRID_INITIALIZE_ERROR',
    PHX_REMOTE_GRID_READ_PENDING: 'PHX_REMOTE_GRID_READ_PENDING',
    PHX_REMOTE_GRID_READ_SUCCESS: 'PHX_REMOTE_GRID_READ_SUCCESS',
    PHX_REMOTE_GRID_READ_ERROR: 'PHX_REMOTE_GRID_READ_ERROR',
    PHX_REMOTE_GRID_SORT_PENDING: 'PHX_REMOTE_GRID_SORT_PENDING',
    PHX_REMOTE_GRID_SORT_SUCCESS: 'PHX_REMOTE_GRID_SORT_SUCCESS',
    PHX_REMOTE_GRID_SORT_ERROR: 'PHX_REMOTE_GRID_SORT_ERROR',
    PHX_REMOTE_GRID_PAGE_CHANGE_PENDING: 'PHX_REMOTE_GRID_PAGE_CHANGE_PENDING',
    PHX_REMOTE_GRID_PAGE_CHANGE_SUCCESS: 'PHX_REMOTE_GRID_PAGE_CHANGE_SUCCESS',
    PHX_REMOTE_GRID_PAGE_CHANGE_ERROR: 'PHX_REMOTE_GRID_PAGE_CHANGE_ERROR',
    PHX_REMOTE_GRID_UI_PAGINATION_UPDATED: 'PHX_REMOTE_GRID_UI_PAGINATION_UPDATED',
}

@Injectable()
export class PhxRmtGridActions {
    constructor(private ngRedux: NgRedux<IAppState>, private api: ApiService) {
    }

    //?? has to do with render..ui state?
    phxGridInitialize(init: IPhxRmtGridInit) {
        this.ngRedux.dispatch({
            type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_INITIALIZE_PENDING,
            payload: init
        });

        this.ngRedux.dispatch({
            type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_INITIALIZE_SUCCESS
        });
    }

    phxGridRead(request: IPhxRmtGridRequest) {
        this.ngRedux.dispatch({
            type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_READ_PENDING,
            payload: request
        });

        this.api.get(this.calcUriFromStore())
            .do(res => this.ngRedux.dispatch({
                type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_READ_SUCCESS,
                payload: {
                    total: res.total,
                    data: res.data
                }
            }))
            .do(() => this.phxGridUpdatePagination())
            .catch(() => this.ngRedux.dispatch({
                type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_READ_ERROR
            })).subscribe();
    }


    phxGridSort(descriptor: IPhxRmtGridSortDescriptor) {
        this.ngRedux.dispatch({
            type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_SORT_PENDING,
            payload: descriptor
        });

        this.api.get(this.calcUriFromStore())
            .do(res => this.ngRedux.dispatch({
                type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_SORT_SUCCESS,
                payload: {
                    total: res.total,
                    data: res.data
                }
            }))
            .do(() => this.phxGridUpdatePagination())
            .catch(() => this.ngRedux.dispatch({
                type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_SORT_ERROR
            })).subscribe();
    }

    phxGridPageChange(page: number) {
        this.ngRedux.dispatch({
            type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_PAGE_CHANGE_PENDING,
            payload: {
                page: page
            }
        });

        this.api.get(this.calcUriFromStore())
            .do(res => this.ngRedux.dispatch({
                type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_PAGE_CHANGE_SUCCESS,
                payload: {
                    total: res.total,
                    data: res.data
                }
            }))
            .do(() => this.phxGridUpdatePagination())
            .catch(() => this.ngRedux.dispatch({
                type: PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_PAGE_CHANGE_ERROR
            })).subscribe();
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


    private calcUriFromStore(): string {
        const state = this.ngRedux.getState();
        let uri = state.phxRmtGrid.setting.dataSource + `?page=${state.phxRmtGrid.page}&pageSize=${state.phxRmtGrid.pageSize}`;
        if (state.phxRmtGrid.sort && state.phxRmtGrid.by) {
            uri += `&sort=${state.phxRmtGrid.sort}&by=${state.phxRmtGrid.by}`;
        }
        return uri;
    }
}

//use these in view..
export interface IPhxRmtGridInit {
    id: string;
    pageSize: number;
    allowDelete: boolean;
    allowSorting: boolean;
    initialPage: number;
    dataSource: string;
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