import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'test-display',
    template: `
    <h1>Video</h1>
    <youtube-adapter>
    </youtube-adapter>    
    `
})
export class TestDisplayComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}