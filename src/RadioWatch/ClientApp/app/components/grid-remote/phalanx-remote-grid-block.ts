import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'phx-remote-grid-block',
    template: `
    <div>
        {{value}}
    </div>`
})
export class PhalanxRemoteGridBlockComponent implements OnInit {
    constructor() { }

    @Input() value: any;

    ngOnInit() { }
}