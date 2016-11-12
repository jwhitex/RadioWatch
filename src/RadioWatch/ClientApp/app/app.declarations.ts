import * as containers from './containers/_addenda';
import * as uiComponents from './ui/_addenda';
import * as pipes from './pipes/_addenda';

const mapValuesToArray = (obj) => Object.keys(obj).map(key => obj[key]);

export const containerDeclarations = [
    ...mapValuesToArray(containers)
];
