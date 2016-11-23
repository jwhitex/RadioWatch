import { Component, OnInit, Input, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { YoutubeWindowActions, IYoutubeSearch  } from '../../actions';
import { IYoutubeWindowState } from '../../store';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
    selector: 'youtube-embed',
    template: require('./youtube-embed.html'),
    styles: [require('./youtube-embed.css')],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class YoutubeEmbedComponent implements OnInit, AfterViewInit {
    constructor(private youtubeActions: YoutubeWindowActions) { }

    //todo: try getting off of window..
    @Input() playerId: string = "youtube_embed_placeholder";
    @Input() playerWindow: IYoutubeWindowState; 
   
    ngOnInit() {
       //could emit instead of call directly...
        //this.youtubeActions.initYoutubeWindow(this.playerId);
    }

    ngAfterViewInit(){
        debugger;
        this.youtubeActions.initYoutubeWindow(this.playerId);
    }

    play(e){
        this.youtubeActions.startVideo(this.playerId);
    }

    stop(){
        // attach to player status?
    }
}