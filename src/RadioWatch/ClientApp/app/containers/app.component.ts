import { Component, AfterViewInit} from '@angular/core';
import { YoutubeScriptService } from "../services/global/_addenda";
import { NgRedux, DevToolsExtension } from 'ng2-redux';
import { IAppState, rootReducer, enhancers } from '../store';

@Component({
    selector: 'app',
    template: require('./app.component.html'),
    styles: [require('./app.component.css')]
})
export class AppComponent {
    constructor(public ytScriptService: YoutubeScriptService, ngRedux: NgRedux<IAppState>, devTool: DevToolsExtension) {
        //add middleware and enhancers
        ngRedux.configureStore(rootReducer, {}, [], [...enhancers, devTool.isEnabled() ? devTool.enhancer() : f => f] );
    }

    ngAfterViewInit(): void {
        //this.ytScriptService.pullScripts();
    }
}
