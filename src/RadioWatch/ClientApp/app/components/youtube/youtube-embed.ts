import { Component, Input, Output, ChangeDetectionStrategy, AfterViewInit, EventEmitter } from '@angular/core';
import { YoutubeWindowActions } from '../../actions';
import { IYoutubeWindowState } from '../../store';
import { Subscription, Subject } from 'rxjs';

@Component({
    selector: 'youtube-embed',
    templateUrl: './youtube-embed.html',
    styleUrls: ['./youtube-embed.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeEmbedComponent implements AfterViewInit {
    constructor(private youtubeActions: YoutubeWindowActions) { }

    @Input() playerId: string = "youtube_embed_placeholder";
    @Input() playerWindow: IYoutubeWindowState;
    @Output() youtubeIframeInit = new EventEmitter<string>();

    play(e) {
        this.youtubeActions.startVideo(this.playerId);
    }

    stop() {
        //get attached to youtube video..
        this.youtubeActions.pauseVideo(this.playerId);
    }

    ngAfterViewInit() {
        this.youtubeActions.initYoutubeWindow(this.playerId);
        this.youtubeIframeInit.emit(this.playerId);
    }   
}