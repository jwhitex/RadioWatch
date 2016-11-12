import {combineReducers} from 'redux';
const persistState = require('redux-localstorage');
import { phxGridReducer, IPhxGridState } from './phxgrid.reducer'


export class IAppState {
    phxGrid?: IPhxGridState
}

export const rootReducer = combineReducers<IAppState>({
    phxGrid: phxGridReducer
});


export const enhancers = [
    //dunno will figure..stores in local storage..
    persistState('phxGddrid', { key: 'phxGrid/phxGrid/phxGrid/path' })
];

//reducer pojos
export {
    IPhxGridState,
    IPhxGridColumnState,
    IPhxGridItemState,
    IPhxGridPaginationState,
    IPhxGridSettingState
} from './phxgrid.reducer';


