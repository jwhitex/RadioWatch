import { combineReducers } from 'redux';
const persistState = require('redux-localstorage');
import { phxGridReducer, IPhxGridState } from './phxgrid.reducer'
import { phxRmtGridReducer, IPhxRmtGridState } from './phxrmtgrid.reducer'
import { youtubeWindowsReducer, IYoutubeWindowsState } from './youtube-window-reducer';
import { appConfigReducer, IAppConfigState } from './app-config-reducer';

export class IAppState {
    phxGrid?: IPhxGridState;
    phxRmtGrid?: IPhxRmtGridState;
    youtubeWindows?: IYoutubeWindowsState;
    appConfig?: IAppConfigState
}

export const rootReducer = combineReducers<IAppState>({
    phxGrid: phxGridReducer,
    phxRmtGrid: phxRmtGridReducer,
    youtubeWindows: youtubeWindowsReducer,
    appConfig: appConfigReducer
});

function slicer(paths: any) {
    return (state) => {
        let subset = state;
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
export {
    IAppConfigState
} from './app-config-reducer'
