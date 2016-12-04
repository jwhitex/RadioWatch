import { Component, Input, AfterViewInit } from '@angular/core';
import { DocumentRefService } from '../../services';


@Component({
    selector: 'phx-grid-expansion',
    templateUrl: './phalanx-grid-expansion.html',
})
export class PhalanxGridExpansionComponent implements AfterViewInit {
    expansionId: string;
    collapseValue
    constructor(private documentRefService: DocumentRefService) {
        let min = 1000;
        let max = 100000
        const val = Math.floor(Math.random() * (max - min)) + min;
        this.expansionId = `phxGridExpansion_${val}`;
    }

    ngAfterViewInit() {
    }
}