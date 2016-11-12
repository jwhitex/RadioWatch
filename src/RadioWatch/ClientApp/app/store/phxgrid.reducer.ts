import { List } from 'immutable';
import { tassign } from 'tassign';
import { PHX_GRID_ACTIONS } from '../actions/phalanxgrid.actions';

export interface IPhxGridState {
    id: string;
    data: List<IPhxGridItemState>;
    page: number;
    pageSize: number;
    sort: string;
    by: number;
    totalRows: number;
    pages: List<number>;
    //display properties...
    paginationWidth: string;
    paginationButtonColors: List<IPhxGridPaginationState>;

    //initial settings...
    setting: IPhxGridSettingState
}

export interface IPhxGridSettingState {
    allowDelete: boolean;
    allowSorting: boolean;
    columns: List<IPhxGridColumnState>;
    initialPage: number;
    dataSource: string;
}

export interface IPhxGridColumnState {
    colName: string,
    dataName: string,
    sortable: boolean,
    visible: boolean,
    date_pipe: string,   
}

export interface IPhxGridPaginationState {
    background: string;
    character: string;
}

export interface IPhxGridItemState {
    data: Object;
}

const INIT_STATE: IPhxGridState = {
    id: '',
    data: List<IPhxGridItemState>([]),
    page: 0,
    pageSize: 10,
    sort: '',
    by: 1,
    totalRows: 0,
    pages: List<number>([]),
    paginationWidth: '',
    paginationButtonColors: List<IPhxGridPaginationState>([]),
    setting: {       
        allowDelete: false,
        allowSorting: false,
        columns: List<IPhxGridColumnState>([]),
        initialPage: 0,
        dataSource: ''
    }
}


export function phxGridReducer(state = INIT_STATE, action): IPhxGridState {
    const ap = action.payload;
    switch (action.type) {
        case PHX_GRID_ACTIONS.PHX_GRID_INITIALIZE_PENDING:
            return tassign(state,
            {
                id: ap.id,
                pageSize: ap.pageSize,
                setting: tassign(state.setting,
                {
                    allowDelete: ap.allowDelete,
                    allowSorting: ap.allowSorting,
                    initialPage: ap.initialPage,
                    dataSource: ap.dataSource,
                    columns: List<IPhxGridColumnState>(ap.columns)
                })
            });
        case PHX_GRID_ACTIONS.PHX_GRID_READ_PENDING:
            return tassign(state, {
                page: ap.page,
                pageSize: ap.pageSize,
                sort: ap.sort,
                by: ap.by
            });
        case PHX_GRID_ACTIONS.PHX_GRID_READ_SUCCESS:
        case PHX_GRID_ACTIONS.PHX_GRID_SORT_SUCCESS:
        case PHX_GRID_ACTIONS.PHX_GRID_PAGE_CHANGE_SUCCESS:
            return tassign(state, {
                totalRows: ap.total,
                data: List<IPhxGridItemState>(ap.data.map((x) => Object.assign({},{ data: x })))
            });
        case PHX_GRID_ACTIONS.PHX_GRID_SORT_PENDING:
            return tassign(state, {
                sort: ap.sort,
                by: ap.by
            });
        case PHX_GRID_ACTIONS.PHX_GRID_PAGE_CHANGE_PENDING:
            return tassign(state, {
                page: ap.page
            });
        case PHX_GRID_ACTIONS.PHX_GRID_UI_PAGINATION_UPDATED:
            return tassign(state, {
                pages: ap.pages,
                paginationWidth: ap.paginationWidth,
                paginationButtonColors: ap.paginationButtonColors
            });
        //todo: error actions
        default:
            return state;

    }
}