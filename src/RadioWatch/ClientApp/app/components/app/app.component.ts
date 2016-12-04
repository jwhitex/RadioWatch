import { Component, AfterViewInit, OnInit } from '@angular/core';
import { YoutubeService } from "../../services";
import { NgRedux, DevToolsExtension } from 'ng2-redux';
import { IAppState, rootReducer, enhancers } from '../../store';
import { AppConfigActions } from '../../actions'

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
    constructor(private ytService: YoutubeService, private appConfigActions: AppConfigActions,  ngRedux: NgRedux<IAppState>, devTool: DevToolsExtension) {
        //add middleware and enhancers
        ngRedux.configureStore(rootReducer, {}, [], [...enhancers, devTool.isEnabled() ? devTool.enhancer() : f => f] );
        appConfigActions.getYoutubeApiToken();
    }
    
    ngAfterViewInit(): void {
        this.ytService.pullScripts();
    }
}
