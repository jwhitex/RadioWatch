import {
    Component, Input, Output, ChangeDetectionStrategy, EventEmitter, AfterViewInit,
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/core';
import { IPhxRmtGridSettingState, IPhxRmtGridItemState, IPhxRmtGridPaginationState, IPhxRmtGridColumnState } from '../../store';
import { List, Iterable } from 'immutable';
import { Observable } from 'rxjs';

@Component({
    selector: 'phx-remote-grid-ui',
    templateUrl: './phalanx-remote-grid-ui.html',
    changeDetection: ChangeDetectionStrategy.Default,
    animations: [
        trigger('rollHeightAndFade', [
            state('expansion', style({ height: '*', opacity: 1 })),
            transition('void => expansion', [
                style({ height: 0, opacity: 0 }),
                animate(300, style({ height: '*' })),
                animate(300, style({ opacity: 1 }))
            ]),
            transition('expansion => void', [
                style({ height: '*',opacity: 1 }),
                animate(300, style({ opacity: 0 })),
                animate(300, style({ height: 0 }))
            ])
        ]),
        trigger('fadeIn',[
            transition('void => PLS_FADE', [
                style({ opacity: 0 }),
                animate(300, style({ opacity: 1 }))
            ]),
        ])
    ]
})
export class PhalanxRemoteGridUiComponent implements AfterViewInit {
    constructor() { }

    //constants? Maybe create a file in each component folder?
    PLS_FADE = 'PLS_FADE';
    NO_FADE = 'NO_FADE';
    DROP_ALL_ANIMATIONS = 'DROP_ALL_ANIMATIONS';

    //Since expansion..have to line up grid blocks. 
    //todo: This should be calculated from what user wishes to be displayed i.e `${count*10}%`
    gridBlockWidthPercent = '30%'

    //Expansion rewrites the grid..
    whenGridPopulating = this.PLS_FADE;

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
        this.whenGridPopulating = this.PLS_FADE;
        this.changePageEvent.emit(page)
        this.setNoFade();
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
    
    //todo: implement
    deleteRow(row) {}

    ngAfterViewInit() {
        this.setNoFade();
    }
   
    setNoFade() {
        //less than ideal..counting on no computation to perform as it does on localhost..
        let obs = Observable.timer(400).take(1);
        obs.subscribe(() => this.whenGridPopulating = this.NO_FADE);
    }
}