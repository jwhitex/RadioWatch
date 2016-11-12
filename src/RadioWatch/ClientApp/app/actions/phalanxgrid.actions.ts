import { Injectable } from '@angular/core';
import { IAppState } from '../store';
import { NgRedux } from 'ng2-redux';
import { List } from 'immutable';
import { ApiService } from '../services/global/_addenda'

export const PHX_GRID_ACTIONS = {
    PHX_GRID_INITIALIZE_PENDING: 'PHX_GRID_INITIALIZE_PENDING',
    PHX_GRID_INITIALIZE_SUCCESS: 'PHX_GRID_INITIALIZE_SUCCESS',
    PHX_GRID_INITIALIZE_ERROR: 'PHX_GRID_INITIALIZE_ERROR',
    PHX_GRID_READ_PENDING: 'PHX_GRID_READ_PENDING',
    PHX_GRID_READ_SUCCESS: 'PHX_GRID_READ_SUCCESS',
    PHX_GRID_READ_ERROR: 'PHX_GRID_READ_ERROR',
    PHX_GRID_SORT_PENDING: 'PHX_GRID_SORT_PENDING',
    PHX_GRID_SORT_SUCCESS: 'PHX_GRID_SORT_SUCCESS',
    PHX_GRID_SORT_ERROR: 'PHX_GRID_SORT_ERROR',
    PHX_GRID_PAGE_CHANGE_PENDING: 'PHX_GRID_PAGE_CHANGE_PENDING',
    PHX_GRID_PAGE_CHANGE_SUCCESS: 'PHX_GRID_PAGE_CHANGE_SUCCESS',
    PHX_GRID_PAGE_CHANGE_ERROR: 'PHX_GRID_PAGE_CHANGE_ERROR',
    PHX_GRID_UI_PAGINATION_UPDATED: 'PHX_GRID_PAGINATION_UPDATED',
}

@Injectable()
export class PhxGridActions {
    constructor(private ngRedux: NgRedux<IAppState>, private api: ApiService) {
    }

    //?? has to do with render..ui state?
    phxGridInitialize(init: IPhxGridInit) {
        this.ngRedux.dispatch({
            type: PHX_GRID_ACTIONS.PHX_GRID_INITIALIZE_PENDING,
            payload: init
        });

        this.ngRedux.dispatch({
            type: PHX_GRID_ACTIONS.PHX_GRID_INITIALIZE_SUCCESS
        });
    }

    phxGridRead(request: IPhxGridRequest) {
        this.ngRedux.dispatch({
            type: PHX_GRID_ACTIONS.PHX_GRID_READ_PENDING,
            payload: request
        });

        this.api.get(this.calcUriFromStore())
            .do(res => this.ngRedux.dispatch({
                type: PHX_GRID_ACTIONS.PHX_GRID_READ_SUCCESS,
                payload: {
                    total: res.total,
                    data: res.data
                }
            }))
            //.do(() => this.phxGridUpdatePagination())
            .catch(() => this.ngRedux.dispatch({
                type: PHX_GRID_ACTIONS.PHX_GRID_READ_ERROR
            })).subscribe();
    }


    phxGridSort(descriptor: IPhxGridSortDescriptor) {
        this.ngRedux.dispatch({
            type: PHX_GRID_ACTIONS.PHX_GRID_SORT_PENDING,
            payload: descriptor
        });

        this.api.get(this.calcUriFromStore())
            .do(res => this.ngRedux.dispatch({
                type: PHX_GRID_ACTIONS.PHX_GRID_SORT_SUCCESS,
                payload: {
                    total: res.total,
                    data: res.data
                }
            }))
            .do(() => this.phxGridUpdatePagination())
            .catch(() => this.ngRedux.dispatch({
                type: PHX_GRID_ACTIONS.PHX_GRID_SORT_ERROR
            })).subscribe();
    }

    phxGridPageChange(page: number) {
        this.ngRedux.dispatch({
            type: PHX_GRID_ACTIONS.PHX_GRID_PAGE_CHANGE_PENDING,
            payload: {
                page: page
            }
        });

        this.api.get(this.calcUriFromStore())
            .do(res => this.ngRedux.dispatch({
                type: PHX_GRID_ACTIONS.PHX_GRID_PAGE_CHANGE_SUCCESS,
                payload: {
                    total: res.total,
                    data: res.data
                }
            }))
            .do(() => this.phxGridUpdatePagination())
            .catch(() => this.ngRedux.dispatch({
                type: PHX_GRID_ACTIONS.PHX_GRID_PAGE_CHANGE_ERROR
            })).subscribe();
    }

    private phxGridUpdatePagination() {
        const state = this.ngRedux.getState();
        const total = state.phxGrid.totalRows;
        const pageSize = state.phxGrid.pageSize;
        const currentPage = state.phxGrid.page;

        const width = this.calcPaginationWidth(total, pageSize);
        let newPages: number[] = [];
        let newPaginationButtonColors: IPhxGridPagination[] = [];
        for (let i = 0; i < Math.ceil(total / pageSize); i++) {
            newPages.push(i + 1);
            if (currentPage === i)
                newPaginationButtonColors.push({ background: "#fff", character: "#337ab7" });
            newPaginationButtonColors.push({ background: "#337ab7", character: "#fff" });
        }
        this.ngRedux.dispatch({
            type: PHX_GRID_ACTIONS.PHX_GRID_UI_PAGINATION_UPDATED,
            payload: {
                pages: List<number>(newPages),
                paginationWidth: width,
                paginationButtonColors: List<IPhxGridPagination>(newPaginationButtonColors)
            }
        })
    }

    private calcPaginationWidth(total: number, pageSize: number) {
        const totalPages: any = Math.ceil(total / pageSize) + 1;
        return ((totalPages * 80) + pageSize * 3) + "px";
    }


    private calcUriFromStore(): string {
        const state = this.ngRedux.getState();
        let uri = state.phxGrid.setting.dataSource + `?page=${state.phxGrid.page}&pageSize=${state.phxGrid.pageSize}`;
        if (state.phxGrid.sort && state.phxGrid.by) {
            uri += `&sort=${state.phxGrid.sort}&by=${state.phxGrid.by}`;
        }
        return uri;
    }
}

//use these in view..
export interface IPhxGridInit {
    id: string;
    pageSize: number;
    allowDelete: boolean;
    allowSorting: boolean;
    initialPage: number;
    dataSource: string;
    columns: List<IPhxGridInitColumn>;
}

export interface IPhxGridInitColumn {
    colName: string,
    dataName: string,
    sortable: boolean,
    visible: boolean,
    date_pipe: string,
}

export interface IPhxGridRequest {
    pageSize: number;
    page: number;
    sort: string;
    by: number;
}

export interface IPhxGridSortDescriptor {
    sort: string;
    by: number;
}

export interface IPhxGridPagination {
    background: string;
    character: string;
}