import { Component, AfterViewInit} from '@angular/core';
import { YoutubeService } from "../../services";
import { NgRedux, DevToolsExtension } from 'ng2-redux';
import { IAppState, rootReducer, enhancers } from '../../store';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(public ytService: YoutubeService, ngRedux: NgRedux<IAppState>, devTool: DevToolsExtension) {
        //add middleware and enhancers
        ngRedux.configureStore(rootReducer, {}, [], [...enhancers, devTool.isEnabled() ? devTool.enhancer() : f => f] );
    }

    ngAfterViewInit(): void {
        this.ytService.pullScripts();
    }
}