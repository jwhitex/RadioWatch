import { Component } from '@angular/core';
import { IPhxGridInit, IPhxGridInitColumn } from '../../actions';
import { List } from 'immutable';

@Component({
    selector: 'phx-grid-vc',
    template: `
    <phx-grid-lc
    [init]='init'
    >
    </phx-grid-lc>
    `
})
export class PhalanxGridViewComponent {
    constructor() { }

    cols: List<IPhxGridInitColumn> = List<IPhxGridInitColumn>([
        { colName: "Key", dataName: "key", sortable: true, visible: false, date_pipe: null },
        { colName: "Artist", dataName: "artist", sortable: true, visible: true, date_pipe: null },
        { colName: "Song", dataName: "song", sortable: true, visible: true, date_pipe: null },
        { colName: "TimePlayed", dataName: "timePlayed", sortable: true, visible: true, date_pipe: "MM-dd-yyyy" },
    ]);

    init: IPhxGridInit = {
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