import * as services from './services/global/_addenda';
import { YoutubeService } from './services';
import { PhalanxGridStore, PhalanxGridStoreHelper } from './stores/_addenda';
import { PhxGridActions, PhxRmtGridActions, YoutubeWindowActions } from './actions';
import { DevToolsExtension } from 'ng2-redux';

const mapValuesToArray = (obj) => Object.keys(obj).map(key => obj[key]);
export const providers = [
    PhalanxGridStore,
    PhalanxGridStoreHelper,
    PhxGridActions,
    PhxRmtGridActions,
    YoutubeWindowActions,
    DevToolsExtension,
    YoutubeService,
    ...mapValuesToArray(services)
];