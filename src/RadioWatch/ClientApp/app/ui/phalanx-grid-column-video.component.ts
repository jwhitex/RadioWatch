import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '../stores/_addenda';
import 'rxjs/Rx';
import { PipeTransform } from '@angular/core';

@Component({
    selector: 'phalanx-grid-column-video',
    template: require('./phalanx-grid-column-video.component.html'),

})
export class PhalanxGridColumnVideoComponent implements OnInit {
    colName: string;
    sortable: boolean;
    visible: boolean;
    @Input() value: boolean;
    @Input() pipe: PipeTransform;

    ngOnInit() {

    }

}


