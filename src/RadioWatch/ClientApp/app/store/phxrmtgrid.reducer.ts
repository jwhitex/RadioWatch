import { List } from 'immutable';
import { tassign } from 'tassign';
import { PHX_REMOTE_GRID_ACTIONS } from '../actions/phalanxremotegrid.actions';

export interface IPhxRmtGridState {
    id: string;
    data: List<IPhxRmtGridItemState>;
    page: number;
    pageSize: number;
    sort: string;
    by: number;
    totalRows: number;
    pages: List<number>;
    //display properties...
    paginationWidth: string;
    paginationButtonColors: List<IPhxRmtGridPaginationState>;

    //initial settings...
    setting: IPhxRmtGridSettingState
}

export interface IPhxRmtGridSettingState {
    allowDelete: boolean;
    allowSorting: boolean;
    columns: List<IPhxRmtGridColumnState>;
    initialPage: number;
    dataSource: string;
}

export interface IPhxRmtGridColumnState {
    colName: string,
    dataName: string,
    sortable: boolean,
    visible: boolean,
    date_pipe: string,   
}

export interface IPhxRmtGridPaginationState {
    background: string;
    character: string;
}

export interface IPhxRmtGridItemState {
    data: Object;
}

const INIT_STATE: IPhxRmtGridState = {
    id: '',
    data: List<IPhxRmtGridItemState>([]),
    page: 0,
    pageSize: 10,
    sort: '',
    by: 1,
    totalRows: 0,
    pages: List<number>([]),
    paginationWidth: '',
    paginationButtonColors: List<IPhxRmtGridPaginationState>([]),
    setting: {       
        allowDelete: false,
        allowSorting: false,
        columns: List<IPhxRmtGridColumnState>([]),
        initialPage: 0,
        dataSource: ''
    }
}


export function phxRmtGridReducer(state = INIT_STATE, action): IPhxRmtGridState {
    const ap = action.payload;
    switch (action.type) {
        case PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_INITIALIZE_PENDING:
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
                    columns: List<IPhxRmtGridColumnState>(ap.columns)
                })
            });
        case PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_READ_PENDING:
            return tassign(state, {
                page: ap.page,
                pageSize: ap.pageSize,
                sort: ap.sort,
                by: ap.by
            });
        case PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_READ_SUCCESS:
        case PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_SORT_SUCCESS:
        case PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_PAGE_CHANGE_SUCCESS:
            return tassign(state, {
                totalRows: ap.total,
                data: List<IPhxRmtGridItemState>(ap.data.map((x) => Object.assign({},{ data: x })))
            });
        case PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_SORT_PENDING:
            return tassign(state, {
                sort: ap.sort,
                by: ap.by
            });
        case PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_PAGE_CHANGE_PENDING:
            return tassign(state, {
                page: ap.page
            });
        case PHX_REMOTE_GRID_ACTIONS.PHX_REMOTE_GRID_UI_PAGINATION_UPDATED:
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