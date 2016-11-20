import { Component, OnInit, Input } from '@angular/core';
import { 
    PhxGridActions, 
    IPhxGridInit,
 } from '../../actions';
import { select } from 'ng2-redux';
import { Observable, Subscription } from 'rxjs';
import { IPhxGridSettingState, IPhxGridItemState, IPhxGridPaginationState, IPhxGridColumnState } from '../../store';
import { List, Iterable } from 'immutable';
import { AsyncPipe } from '@angular/common';


@Component({
    selector: 'phx-grid',
    providers: [ PhxGridActions, AsyncPipe ],
    template: `
    <phx-grid-ui
    [data]='data$ | async'
    [setting]='setting$ | async'
    [paginationButtonColors]='paginationButtonColors$ | async'
    [paginationWidth]='paginationWidth$ | async'
    [pages]='pages$ | async'
    [by]='by$ | async'
    [page]='page$ | async'
    (changePageEvent)="onPageChange($event)"
    (sortEvent)="onSort($event)"
    ></phx-grid-ui>
    `
})
export class PhalanxGridComponent implements OnInit {
    @Input() init: IPhxGridInit;
       
    @select(['phxGrid', 'data']) data$: Observable<List<IPhxGridItemState>>;
    @select(['phxGrid', 'setting']) setting$: Observable<IPhxGridSettingState>;
    @select(['phxGrid', 'paginationButtonColors']) paginationButtonColors$: Observable<List<IPhxGridPaginationState>>;
    @select(['phxGrid', 'paginationWidth']) paginationWidth$: Observable<string>;
    @select(['phxGrid', 'pages']) pages$: Observable<List<number>>;
    @select(['phxGrid', 'by']) by$: Observable<number>;
    @select(['phxGrid', 'page']) page$: Observable<number>;
     
    constructor(private phxGridActions: PhxGridActions) {
    }

    ngOnInit() {
        this.phxGridActions.phxGridInitialize(this.init);
        this.phxGridActions.phxGridRead({
            pageSize: this.init.pageSize,
            page: 0,
            sort: null,
            by: 1
        });
     }

     onPageChange(page: number){
         this.phxGridActions.phxGridPageChange(page);
     }

     onSort(sortBy){
         this.phxGridActions.phxGridSort(sortBy);
     }

     onDeleteRow(){
         //not implemented
     }
}