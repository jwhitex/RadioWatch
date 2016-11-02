import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '../stores/_addenda';
import 'rxjs/Rx';
import { PipeTransform } from '@angular/core';

@Component({
    selector: 'phalanx-grid-column',
    template: require('./phalanx-grid-column.component.html'),
    
})
export class PhalanxGridColumnComponent implements  OnInit {
    colName: string;
    sortable: boolean;
    visible: boolean;
    @Input() value: boolean;
    @Input() pipe: PipeTransform;

    ngOnInit() {
        
    }

}


