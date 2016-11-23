import * as containers from './containers';

const mapValuesToArray = (obj) => Object.keys(obj).map(key => obj[key]);

export const containerDeclarations = [
    ...mapValuesToArray(containers)
];
