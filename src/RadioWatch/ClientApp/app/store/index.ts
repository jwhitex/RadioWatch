import { combineReducers } from 'redux';
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

function slicer(paths: any) {
    return (state) => {
        let subset = {}
        return subset;
    }
}

const config = {
    key: "local",
    slicer: slicer
}

export const enhancers = [
    persistState("phxGrid", config)
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
