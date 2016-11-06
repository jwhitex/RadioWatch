import { Injectable } from '@angular/core';

function _window(): any {
    // return the global native browser window object
    if (typeof window !== "undefined" && window)
        return window;
    else
        return undefined;
}

@Injectable()
export class WindowRefService {
    get nativeWindow(): any {
        return _window();
    }
}