import {combineReducers} from 'redux';
const persistState = require('redux-localstorage');
import { phxGridReducer, IPhxGridState } from './phxgrid.reducer'
import { phxRmtGridReducer, IPhxRmtGridState } from './phxrmtgrid.reducer'


export class IAppState {
    phxGrid?: IPhxGridState;
    phxRmtGrid?: IPhxRmtGridState;
}

export const rootReducer = combineReducers<IAppState>({
    phxGrid: phxGridReducer,
    phxRmtGrid: phxRmtGridReducer
});


export const enhancers = [
    //dunno will figure..stores in local storage..
    persistState('radiowatchstore', { key: 'radio/watch/' })
];

//reducer pojos
export {
    IPhxGridState,
    IPhxGridColumnState,
    IPhxGridItemState,
    IPhxGridPaginationState,
    IPhxGridSettingState
} from './phxgrid.reducer';

export {
    IPhxRmtGridState,
    IPhxRmtGridColumnState,
    IPhxRmtGridItemState,
    IPhxRmtGridPaginationState,
    IPhxRmtGridSettingState
} from './phxrmtgrid.reducer';
