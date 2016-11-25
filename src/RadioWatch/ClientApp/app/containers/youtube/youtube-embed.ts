import { Component, Input, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { YoutubeWindowActions } from '../../actions';
import { IYoutubeWindowState } from '../../store';

@Component({
    selector: 'youtube-embed',
    template: require('./youtube-embed.html'),
    styles: [require('./youtube-embed.css')],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeEmbedComponent implements AfterViewInit {
    constructor(private youtubeActions: YoutubeWindowActions) { }

    @Input() playerId: string = "youtube_embed_placeholder";
    @Input() playerWindow: IYoutubeWindowState;

    play(e) {
        this.youtubeActions.startVideo(this.playerId);
    }

    stop() {
        //get attached to youtube video..
        this.youtubeActions.stopVideo(this.playerId);
    }

    ngAfterViewInit() {
        this.youtubeActions.initYoutubeWindow(this.playerId);
    }
}