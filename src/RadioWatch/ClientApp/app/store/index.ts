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
    youtubeWindows: youtubeWindowsReducer,
});

//remove youtube state from local storage..
function slicer(paths: any) {
    return (state) => {
        let subset = {
            phxGrid: state.phxGrid,
            phxRmtGrid: state.phxRmtGrid
        };
        return subset;
    }
}

const config = {
    key: "localAppState",
    slicer: slicer
}

export const enhancers = [
    persistState("appState", config)
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

