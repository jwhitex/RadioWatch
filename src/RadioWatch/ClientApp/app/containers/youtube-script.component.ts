import { Component, Input, AfterViewInit } from '@angular/core';
import {  DocumentRefService } from "../services/_addenda";

@Component({
    selector: "youtube-script",
    template: `
        <div></div>
    `
})
export class YoutubeScriptComponent implements AfterViewInit {
    documentDefined = false;
    constructor(public documentService: DocumentRefService) {
        
        this.setupYoutubeScripts();
    }

    ngAfterViewInit(): void {
        if (!this.documentDefined) {
            this.setupYoutubeScripts();
        }
    }

    setupYoutubeScripts(): void {
        if (typeof this.documentService.nativeDocument !== "undefined") {
            const source = "https://www.youtube.com/iframe_api";
            const ref = this.documentService.nativeDocument.getElementsByTagName("script");
            for (let i = 0; i < ref.length; i++) {
                const element = ref.item(i);
                if (element.src === source) {
                    this.documentDefined = true;
                    return;
                }
            }
            const tag = this.documentService.nativeDocument.createElement("script");
            tag.src = source;
            const firstScriptTag = ref[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            this.documentDefined = true;
        }
    }
}
