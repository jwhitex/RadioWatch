import { Component, OnInit, Input } from '@angular/core';
import {
    PhxRmtGridActions,
    IPhxRmtGridInit,
    GridDataGetter,
    GridDataSourceBuilder
} from '../../actions';
import { select } from 'ng2-redux';
import { Observer, Observable, Subscription, BehaviorSubject } from 'rxjs';
import {
    IPhxRmtGridSettingState,
    IPhxRmtGridItemState,
    IPhxRmtGridPaginationState,
    IPhxRmtGridColumnState
} from '../../store';
import { List, Iterable } from 'immutable';
import { AsyncPipe } from '@angular/common';


@Component({
    selector: 'phx-remote-grid',
    providers: [PhxRmtGridActions, AsyncPipe],
    template: `
    <phx-remote-grid-ui
    [displayData]='displayData$ | async'
    [setting]='setting$ | async'
    [paginationButtonColors]='paginationButtonColors$ | async'
    [paginationWidth]='paginationWidth$ | async'
    [pages]='pages$ | async'
    [by]='by$ | async'
    [page]='page$ | async'
    (changePageEvent)="onPageChange($event)"
    (sortEvent)="onSort($event)"
    ></phx-remote-grid-ui>
    `
})
export class PhalanxRemoteGridComponent implements OnInit {
    @Input() init: IPhxRmtGridInit;
    @Input() dataSourceChanged: BehaviorSubject<any>;
    @Input() dataExtractionDevice: Observable<any>;

    @select(['phxRmtGrid', 'displayData']) displayData$: Observable<List<IPhxRmtGridItemState>>;
    @select(['phxRmtGrid', 'setting']) setting$: Observable<IPhxRmtGridSettingState>;
    @select(['phxRmtGrid', 'paginationButtonColors']) paginationButtonColors$: Observable<List<IPhxRmtGridPaginationState>>;
    @select(['phxRmtGrid', 'paginationWidth']) paginationWidth$: Observable<string>;
    @select(['phxRmtGrid', 'pages']) pages$: Observable<List<number>>;
    @select(['phxRmtGrid', 'by']) by$: Observable<number>;
    @select(['phxRmtGrid', 'page']) page$: Observable<number>;



    constructor(private phxRmtGridActions: PhxRmtGridActions) {

    }

    ngOnInit() {
        this.phxRmtGridActions.phxGridInitialize(this.init);
        this.dataSourceChanged.subscribe((dataSource) => {
            this.phxRmtGridActions.phxGridRead({
                dataSource: dataSource,
                pageSize: this.init.pageSize,
                page: 0,
                sort: null,
                by: 1
            }, this.dataExtractionDevice)
        });
    }

    onPageChange(page: number) {
        this.phxRmtGridActions.phxGridPageChange(page);
    }

    onSort(sortBy) {
        this.phxRmtGridActions.phxGridSort(sortBy);
    }

    onDeleteRow() {
        //not implemented
    }

    private dataSourceChange() {

    }
}