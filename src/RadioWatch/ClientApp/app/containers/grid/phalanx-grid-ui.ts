import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { IPhxGridSettingState, IPhxGridItemState, IPhxGridPaginationState, IPhxGridColumnState } from '../../store';
import { List, Iterable } from 'immutable';


@Component({
    selector: 'phx-grid-ui',
    template: require('./phalanx-grid-ui.html'),
    changeDetection: ChangeDetectionStrategy.Default
})
export class PhalanxGridUiComponent {
    constructor() { }

    @Input() data: List<IPhxGridItemState>
    @Input() setting: IPhxGridSettingState
    @Input() paginationButtonColors: List<IPhxGridPaginationState>
    @Input() paginationWidth: string
    @Input() pages: List<number>
    @Input() by: number
    @Input() page: number
       
    @Output() changePageEvent = new EventEmitter<number>();
    @Output() sortEvent = new EventEmitter();

    sort(sort, by) {
        this.sortEvent.emit({ sort: sort, by: by })
    }

    deleteRow(row) {
    }

    changePage(page) {
        this.changePageEvent.emit(page);
    }
}