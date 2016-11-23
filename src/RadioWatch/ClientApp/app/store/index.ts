import {combineReducers} from 'redux';
const persistState = require('redux-localstorage');
import { phxGridReducer, IPhxGridState } from './phxgrid.reducer'
import { phxRmtGridReducer, IPhxRmtGridState } from './phxrmtgrid.reducer'
import { youtubeWindowsReducer, IYoutubeWindowsState } from './youtube-window-reducer';

export class IAppState {
    phxGrid?: IPhxGridState;
    phxRmtGrid?: IPhxRmtGridState;
    youtubeWindows?: IYoutubeWindowsState;
}

export const rootReducer = combineReducers<IAppState>({
    phxGrid: phxGridReducer,
    phxRmtGrid: phxRmtGridReducer,
    youtubeWindows: youtubeWindowsReducer
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

export {
    IYoutubeWindowsState,
    IYoutubeWindowState
} from './youtube-window-reducer';
