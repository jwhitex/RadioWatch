import { Component, AfterViewInit, OnInit } from '@angular/core';
import { YoutubeService } from "../../services";
import { NgRedux, DevToolsExtension } from 'ng2-redux';
import { IAppState, rootReducer, enhancers } from '../../store';
let config = require('config');

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
    constructor(private ytService: YoutubeService,  ngRedux: NgRedux<IAppState>, devTool: DevToolsExtension) {
        //add middleware and enhancers
        ngRedux.configureStore(rootReducer, {}, [], [...enhancers, devTool.isEnabled() && config.mode == 'development' ? devTool.enhancer() : f => f] );
    }
    
    ngAfterViewInit(): void {
        this.ytService.pullScripts();
    }
}
