import {
    Component, OnInit, Input, OnDestroy,
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/core';
import {
    PhxRmtGridActions,
    IPhxRmtGridInit,
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
    <div [@info_fadeIn]='(action$ | async)' *ngIf='(action$ | async) === NO_RESULTS'> 
            <article class="message is-info">
        <div class="message-header">
        <span class='icon'>
            <i class="fa fa-info-circle" aria-hidden="true"></i>
        </span>
        No Results</div>
        <div class="message-body">
            Try entering a date earlier than today.
        </div>
        </article>
    </div>
    <div [@fadeInOut]='(action$ | async)' *ngIf='(action$ | async) === RESULTS_VALID'>
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
    (expandRowEvent)="onExpandRow($event)"
    (collapseRowEvent)="onCollapseRow($event)"
    ></phx-remote-grid-ui>
    </div>
    `,
    animations: [
        trigger('info_fadeIn', [
            state('NO_RESULTS', style({ opacity: 1 })),
            transition('* => NO_RESULTS', [
                style({ opacity: 0 }),
                animate(300, style({ opacity: 1 }))
            ]),
        ]),
        trigger('fadeInOut', [
            state('RESULTS_VALID', style({ opacity: 1 })),
            transition('* => RESULTS_VALID', [
                style({ opacity: 0 }),
                animate(300, style({ opacity: 1 }))
            ]),
        ])
    ]
})
export class PhalanxRemoteGridComponent implements OnInit, OnDestroy {
    @select(['phxRmtGrid', 'action']) action$: Observable<string>;

    NO_RESULTS = "NO_RESULTS";
    SEARCHING = "SEARCHING";
    RESULTS_VALID = "RESULTS_VALID";
    SEARCH_ERROR = "SEARCH_ERROR";
    animationState = 'NO_RESULTS';

    @Input() init: IPhxRmtGridInit;
    @Input() dataSourceChanged: BehaviorSubject<string>;
    @Input() dataExtractionDevice: Observable<any>;
    @Input() extraData: BehaviorSubject<any>;

    @select(['phxRmtGrid', 'displayData']) displayData$: Observable<List<IPhxRmtGridItemState>>;
    @select(['phxRmtGrid', 'setting']) setting$: Observable<IPhxRmtGridSettingState>;
    @select(['phxRmtGrid', 'paginationButtonColors']) paginationButtonColors$: Observable<List<IPhxRmtGridPaginationState>>;
    @select(['phxRmtGrid', 'paginationWidth']) paginationWidth$: Observable<string>;
    @select(['phxRmtGrid', 'pages']) pages$: Observable<List<number>>;
    @select(['phxRmtGrid', 'by']) by$: Observable<number>;
    @select(['phxRmtGrid', 'page']) page$: Observable<number>;

    subscriptions: List<Subscription>;
    constructor(private phxRmtGridActions: PhxRmtGridActions) {
        this.subscriptions = List<Subscription>([]);
    }

    ngOnInit() {
            this.phxRmtGridActions.phxGridInitialize(this.init);
            this.extraData.subscribe((extraData) => {
                this.phxRmtGridActions.phxGridStoreExtraData(extraData);
            });
            this.dataSourceChanged.subscribe((dataSource) => {
                this.phxRmtGridActions.phxGridRead({
                    dataSource: dataSource,
                    pageSize: this.init.pageSize,
                    page: 0,
                    sort: null,
                    by: 1
                }, this.dataExtractionDevice);
            });       
    }

    onPageChange(page: number) {
        this.phxRmtGridActions.phxGridPageChange(page);
    }

    onSort(sortBy) {
        this.phxRmtGridActions.phxGridSort(sortBy);
    }

    onExpandRow(rowInfo) {
        this.phxRmtGridActions.expandRow(rowInfo);
    }
    onCollapseRow(rowInfo) {
        this.phxRmtGridActions.collapseRow(rowInfo);
    }

    onDeleteRow() {
        //not implemented
    }

    ngOnDestroy() {
        this.subscriptions.forEach((value) => value.unsubscribe());
    }
}