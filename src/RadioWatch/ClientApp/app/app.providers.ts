import * as services from './services/global/_addenda';
import { PhalanxGridStore, PhalanxGridStoreHelper } from './stores/_addenda';
import { PhxGridActions } from './actions';
import { DevToolsExtension } from 'ng2-redux';

const mapValuesToArray = (obj) => Object.keys(obj).map(key => obj[key]);
export const providers = [
    PhalanxGridStore,
    PhalanxGridStoreHelper,
    PhxGridActions,
    DevToolsExtension,
    ...mapValuesToArray(services)
];