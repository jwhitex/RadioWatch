import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'test-display',
    template: require('./test-display.html'),
    styles: [require('./test-display.css')]
})
export class TestDisplayComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}