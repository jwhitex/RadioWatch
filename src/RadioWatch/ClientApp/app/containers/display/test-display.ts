import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'test-display',
    template: `
    <h1>Video</h1>
    <youtube-grid-adapter>
    </youtube-grid-adapter>    
    `
})
export class TestDisplayComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}