import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { IPhxGridSettingState, IPhxGridItemState, IPhxGridPaginationState, IPhxGridColumnState } from '../../store';
import { List, Iterable } from 'immutable';

@Component({
    selector: 'phx-grid-ui',
    template: require('./phalanxgrid.ui.html'),
    changeDetection: ChangeDetectionStrategy.Default
})
export class PhalanxGridUiComponent implements OnInit, OnDestroy {
    constructor() { }

    @Input() data: List<IPhxGridItemState>
    @Input() setting: IPhxGridSettingState
    @Input() paginationButtonColors: List<IPhxGridPaginationState>
    @Input() paginationWidth: string
    @Input() pages: List<number>
    @Input() by: number
    @Input() page: number
       

    ngOnInit() {
    }
    
    ngOnDestroy(){
    }

    sort(sort, by) {
    }

    deleteRow(row) {
    }

    changePage(page) {
    }
}