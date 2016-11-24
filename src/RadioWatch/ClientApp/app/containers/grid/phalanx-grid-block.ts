import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'phx-grid-block',
    template: `
    <div>
        {{value}}
    </div>`
})
export class PhalanxGridBlockComponent {
    constructor() { }

    @Input() value: any;
}