import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '../stores/_addenda';
import 'rxjs/Rx';


@Component({
    selector: 'playlist',
    template: require('./playlist.component.html'),
    styles: [require('./playlist.component.css')]
})
export class PlayListComponent {
    pageSize = 10;
    allowDelete = true;
    totalRows: number;
    gridName= 'playlistGrid';
    columnMeta: any = [
       { colName: "key", sortable: true, visible: false },
       { colName: "artist", sortable: true, visible: true },
       { colName: "song", sortable: true, visible: true },
       { colName: "timeplayed", sortable: true, visible: true }
    ];
    //this could be a generic property..
    dataSource: string = "/api/playlist";
    local: boolean = true;

    // columnMeta: any = [
    //     { colName: "id", sortable: true, visible: false },
    //     { colName: "_duration", sortable: true, visible: true },
    //     { colName: "_start_time", sortable: true, visible: true },
    //     { colName: "trackName", sortable: true, visible: true },
    //     { colName: "artistName", sortable: true, visible: true },
    //     { colName: "collectionName", sortable: true, visible: true },
    //     //{ colName: "buy", sortable: true, visible: true }
    // ];
    //dataSource: string = "https://api.composer.nprstations.org/v1/widget/52efef04e1c88f2f9b77741b/playlist?t=1474765907513&prog_id=52efef11e1c88f2f9b777447&datestamp=2016-09-02&order=1&errorMsg=No+results+found.+Please+modify+your+search+and+try+again.";
    //local: boolean = false;
    
}