import { Component, Input, Output, OnInit, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { AutoGridSortPipe } from '../pipes/_addenda';
import { PhalanxGridService } from '../local_services/_addenda';
import { Store } from '../stores/_addenda';

@Component({
    selector: 'phalanx-grid',
    providers: [PhalanxGridService],
    template: require('./phalanx-grid.component.html'),
    styles: [require('./phalanx-grid.component.css')],
})
export class PhalanxGridComponent implements  OnInit, OnDestroy {
    @Input() allowDelete: boolean = false;
    @Input() columns: any = [];
    @Input() allowSorting: boolean = true;
    @Input() pageSize: number = 0;
    @Input() initialPage: number = 0;
    @Input() dataSource: string = "";
    @Input() local: boolean = true;
    @Input() gridName: string = "phalanxGrid1";
    
    data: any = [];
    pages: any = [];
    width: string = "";
    sortBy: string = "";
    direction: number = 1;
    currentPage: number = this.initialPage;
    totalRows: number = 0;
    
    constructor(private phnxGridService: PhalanxGridService, private store: Store) {       
    }
    
    ngOnInit() {
        this.phnxGridService.path = this.dataSource;
        this.phnxGridService.local = this.local;

        this.phnxGridService.initialize("phalanxGrid",
            {
                id: this.gridName,
                pageSize: this.pageSize,
                data: this.data,
                sortBy: this.sortBy,
                direction: this.direction,
                currentPage: this.currentPage,
                totalRows: this.totalRows
            });

        this.store.changes.pluck("phalanxGrid").subscribe((gridStore: any) => {
            const thisGrid = gridStore.find(x => x.id === this.gridName);
            if (typeof thisGrid !== "undefined" && thisGrid) {
                this.data = thisGrid.data;
                this.totalRows = thisGrid.totalRows;
                this.currentPage = thisGrid.currentPage;
            }
        });

        this.read().subscribe();

    }

    //more moduler..
    paginationButtonColors: any[] = [];
    onDataRequest() {
        this.pages = [];
        this.paginationButtonColors = [];
        const totalPages: any = Math.ceil(this.totalRows / this.pageSize) + 1;
        this.width = ((totalPages * 80) + this.pageSize * 3) + "px";

        for (let i = 0; i < Math.ceil(this.totalRows / this.pageSize); i++) {
            this.pages.push(i + 1);
            if (this.currentPage === i)
                this.paginationButtonColors.push({ background: "#fff", character: "#337ab7" });
            this.paginationButtonColors.push({ background: "#337ab7", character: "#fff" });
        }
    }

    onDeleteRow(row: any) {
        this.phnxGridService.removeRow(row, this.currentPage).subscribe();
    }

    onPageIndexChange(page: number) {
        this.phnxGridService.changePage(page).subscribe(() => this.displayCurrentPage(page));
    }

    private displayCurrentPage(page: number) {
        this.paginationButtonColors = this.paginationButtonColors.map((item, index) => {
            if (index === page) {
                return {
                    background: "#fff",
                    character: "#337ab7"
                }
            } else {
                return {
                    background: "#337ab7",
                    character: "#fff"
                };
            }
        });
    }
    
    sort(sort: string, by: number) {
        this.phnxGridService.getData(this.currentPage, sort, by).do(() => {
            this.sortBy = sort;
            this.direction = by;
        }).subscribe();
    }

    bindDataSource(source: string) {
        this.dataSource = source;
        this.phnxGridService.path = this.dataSource;
        return this.read().do(res => this.displayCurrentPage(0));
    }

    read() {
        return this.phnxGridService.getData(this.currentPage).do(res => this.onDataRequest());
    }

    ngOnDestroy(): void {
        this.phnxGridService.purgeGridFromStore();
    }
}
