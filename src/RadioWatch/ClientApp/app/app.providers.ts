import * as services from './services/_addenda';
import { Store, StoreHelper } from './stores/_addenda';

const mapValuesToArray = (obj) => Object.keys(obj).map(key => obj[key]);
export const providers = [
    Store,
    StoreHelper,
    ...mapValuesToArray(services)
];