import { Injectable } from '@angular/core'
import { DocumentRefService } from "./document-ref.service";

@Injectable()
export class YoutubeScriptService {
    constructor(public documentService: DocumentRefService) {
    }

    pullScripts(): void {
        if (typeof this.documentService.nativeDocument !== "undefined") {
            const source = "https://www.youtube.com/iframe_api";
            const ref = this.documentService.nativeDocument.getElementsByTagName("script");
            for (let i = 0; i < ref.length; i++) {
                const element = ref.item(i);
                if (element.src === source) {
                    return;
                }
            }
            const tag = this.documentService.nativeDocument.createElement("script");
            tag.src = source;
            const firstScriptTag = ref[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            console.log("youtube scripts loaded");
        }
    }
}