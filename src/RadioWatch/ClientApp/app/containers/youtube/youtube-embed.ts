import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { YoutubeWindowActions  } from '../../actions';
import { IYoutubeWindowState } from '../../store';

@Component({
    selector: 'youtube-embed',
    template: require('./youtube-embed.html'),
    styles: [require('./youtube-embed.css')],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeEmbedComponent {
    constructor(private youtubeActions: YoutubeWindowActions) { }
    
    @Input() playerId: string = "youtube_embed_placeholder";
    @Input() playerWindow: IYoutubeWindowState;  

    play(e){
        this.youtubeActions.startVideo(this.playerId);
    }

    stop(){
        //get attached to youtube video..
        this.youtubeActions.stopVideo(this.playerId);
    }
}