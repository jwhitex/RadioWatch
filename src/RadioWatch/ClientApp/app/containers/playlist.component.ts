import { Component } from '@angular/core';
import { Store } from '../stores/_addenda';
import 'rxjs/Rx';


@Component({
    selector: 'playlist',
    template: require('./playlist.component.html'),
    styles: [require('./playlist.component.css')]
})
export class PlayListComponent {
    dataSource: string = "/api/playlist";
    local: boolean = true;
    pageSize = 10;
    allowDelete = true;
    allowSort = true;
    gridName = 'playlistGrid';
    columnMeta: any = [
       { colName: "Key", dataName:"key", sortable: true, visible: false, key:true },
       { colName: "Artist", dataName: "artist", sortable: true, visible: true },
       { colName: "Song", dataName: "song", sortable: true, visible: true },
       { colName: "TimePlayed", dataName: "timePlayed", sortable: true, visible: true, date_pipe:"MM-dd-yyyy" }
    ];

    datesomething = (new Date).getTime();

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