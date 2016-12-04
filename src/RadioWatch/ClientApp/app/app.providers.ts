import * as services from './services';
import { YoutubeService } from './services';
import { PhxGridActions, PhxRmtGridActions, YoutubeWindowActions, AppConfigActions } from './actions';
import { DevToolsExtension } from 'ng2-redux';

const mapValuesToArray = (obj) => Object.keys(obj).map(key => obj[key]);
export const providers = [
    PhxGridActions,
    PhxRmtGridActions,
    YoutubeWindowActions,
    AppConfigActions,
    DevToolsExtension,
    YoutubeService,
    ...mapValuesToArray(services)
];