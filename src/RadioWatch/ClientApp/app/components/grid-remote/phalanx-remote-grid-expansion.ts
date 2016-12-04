import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'phx-rmt-grid-expansion',
    templateUrl: './phalanx-remote-grid-expansion.html',
    styleUrls: ['./phalanx-remote-grid-expansion.css'],
})
export class PhalanxRemoteGridExpansionComponent implements OnInit {
    constructor() { }
    @Input() rowData: any;
    searchTerm: string;
    ngOnInit() {
        this.searchTerm = this.rowData.data.artistName + " " + this.rowData.data.trackName;
    }
}