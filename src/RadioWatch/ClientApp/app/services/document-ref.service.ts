import { Injectable } from '@angular/core';

function _document(): any {
    // return the global native browser window object
    if (typeof document !== "undefined" && document)
        return document;
    else
        return undefined;
}

@Injectable()
export class DocumentRefService {
    get nativeDocument(): any {
        return _document();
    }
}