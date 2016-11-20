import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'phx-grid-block',
    template: `
    <div>
        {{value}}
    </div>`
})
export class PhalanxGridBlockComponent implements OnInit {
    constructor() { }

    @Input() value: any;

    ngOnInit() { }
}