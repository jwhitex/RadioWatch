import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { IPhxRmtGridSettingState, IPhxRmtGridItemState, IPhxRmtGridPaginationState, IPhxRmtGridColumnState } from '../../store';
import { List, Iterable } from 'immutable';

@Component({
    selector: 'phx-remote-grid-ui',
    template: require('./phalanx-remote-grid-ui.html'),
    changeDetection: ChangeDetectionStrategy.Default
})
export class PhalanxRemoteGridUiComponent {
    constructor() { }

    @Input() displayData: List<IPhxRmtGridItemState>
    @Input() setting: IPhxRmtGridSettingState
    @Input() paginationButtonColors: List<IPhxRmtGridPaginationState>
    @Input() paginationWidth: string
    @Input() pages: List<number>
    @Input() by: number
    @Input() page: number

    @Output() changePageEvent = new EventEmitter<number>();
    @Output() sortEvent = new EventEmitter();
    @Output() expandRowEvent = new EventEmitter();
    @Output() collapseRowEvent = new EventEmitter();

    changePage(page) {
        this.changePageEvent.emit(page)
    }
    sort(sort, by) {
        this.sortEvent.emit({ sort: sort, by: by })
    }
    expandOrCollapseRow(row, i) {
        if (row.expanded)
            this.collapseRowEvent.emit({ row: row, index: i });
        else
            this.expandRowEvent.emit({ row: row, index: i });
    }
    deleteRow(row) {
    }
}