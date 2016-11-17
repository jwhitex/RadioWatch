import { Component } from '@angular/core';
import { IPhxRmtGridInit, IPhxRmtGridInitColumn } from '../../actions';
import { List } from 'immutable';

@Component({
    selector: 'phx-remote-grid-vc',
    template: `
    <phx-remote-grid-lc
    [init]='init'
    >
    </phx-remote-grid-lc>
    `
})
export class PhalanxRemoteGridViewComponent {
    constructor() { }

    cols: List<IPhxRmtGridInitColumn> = List<IPhxRmtGridInitColumn>([
        { colName: "Key", dataName: "key", sortable: true, visible: false, date_pipe: null },
        { colName: "Artist", dataName: "artist", sortable: true, visible: true, date_pipe: null },
        { colName: "Song", dataName: "song", sortable: true, visible: true, date_pipe: null },
        { colName: "TimePlayed", dataName: "timePlayed", sortable: true, visible: true, date_pipe: "MM-dd-yyyy" },
    ]);

    init: IPhxRmtGridInit = {
        id: 'playlistGrid',
        dataSource: "/api/playlist",
        pageSize: 2,
        allowDelete: true,
        allowSorting: true,
        initialPage: 0,
        columns: this.cols
    }

    ngOnInit() { }
}