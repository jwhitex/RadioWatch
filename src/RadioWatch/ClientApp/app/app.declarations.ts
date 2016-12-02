import * as containers from './components';

const mapValuesToArray = (obj) => Object.keys(obj).map(key => obj[key]);

export const containerDeclarations = [
    ...mapValuesToArray(containers)
];
