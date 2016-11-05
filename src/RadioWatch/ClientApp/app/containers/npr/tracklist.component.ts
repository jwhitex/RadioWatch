import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '../../stores/_addenda';
import 'rxjs/Rx';
import { PhalanxGridComponent } from '../../ui/_addenda';

@Component({
    selector: 'tracklist',
    template: require('./tracklist.component.html'),
    styles: [require('./tracklist.component.css')]
})
export class TrackListComponent implements OnInit {
    @ViewChild(PhalanxGridComponent)
    private gridComponent: PhalanxGridComponent;

    pageSize = 10;
    allowDelete = true;
    allowSort = true;
    gridName = 'trackListGrid';

    columnMeta: any = [
         { colName: "id", dataName:"id", sortable: true, visible: false },
         { colName: "Played", dataName: "_duration", sortable: true, visible: false, date_pipe: "MM-dd-yyyy"},
         { colName: "Start", dataName: "_start_time", sortable: true, visible: true },
         { colName: "Track", dataName: "trackName", sortable: true, visible: true },
         { colName: "Artist", dataName: "artistName", sortable: true, visible: true },
         { colName: "Collection", dataName: "collectionName", sortable: true, visible: true },
         //{ colName: "buy", sortable: true, visible: true }
    ];
    dataSource: string = "https://api.composer.nprstations.org/v1/widget/52efef04e1c88f2f9b77741b/playlist?t=1478134920313&prog_id=52efef11e1c88f2f9b777447&limit=50&errorMsg=No+results+found.+Please+modify+your+search+and+try+again.";
    local: boolean = false;
    //delayRead = true;

    searchFormModel = {
        queryDate: this.getDateAsStringQuery(new Date()),
        queryTerm: ""
    }

    ngOnInit(): void {
        console.log(this.searchFormModel.queryDate);
    }
    
    
    mode: string = "Execute";
    changeMode() {
        if (this.mode === 'Execute') {
            this.mode = 'Executing';
        } else {
            this.mode = 'Execute';
        }
    }

    //helper
    getDateAsStringQuery(date: Date) {
        var day = date.getDate().toString();
        day = day.length === 1 ? `0${day}` : day;
        var month = (date.getMonth() + 1).toString();
        month = month.length === 1 ? `0${month}` : month;
        return `${date.getFullYear()}-${month}-${day}`;
    }
    getDateAsStringRead(date: Date) {
        var day = date.getDate().toString();
        day = day.length === 1 ? `0${day}` : day;
        var month = date.getMonth().toString();
        month = month.length === 1 ? `0${month}` : month;
        return `${date.getMonth()}/${day}/${month}`;
    }

    submitted = false;
    onSubmit() {
        const dateAsDate = new Date(this.searchFormModel.queryDate);
        const dateAsString = this.getDateAsStringQuery(dateAsDate);
        if (this.searchFormModel.queryTerm && this.searchFormModel.queryTerm !== "") {
            //todo: validation on length of query term
            this.searchDateAndKeyword(dateAsString, this.searchFormModel.queryTerm);
        } else {
            this.searchDate(dateAsString);
        }
        this.submitted = true;
    }

    initialKey: string = "52efef04e1c88f2f9b77741b";
    program_id: string = "52efef11e1c88f2f9b777447";   
    searchDate(date: string) {
        const curretTicks = (new Date).getTime();
        //date = "2016-11-01";
        this.dataSource = "https://api.composer.nprstations.org/v1/widget/" + `${this.initialKey}/playlist?t=${curretTicks}&prog_id=${this.program_id}&datestamp=${date}&order=1&time=00%3A30&errorMsg=No+results+found.+Please+modify+your+search+and+try+again.`;
        this.gridComponent.bindDataSource(this.dataSource);
    }

    searchDateAndKeyword(date: string, keyword: string) {
        const curretTicks = (new Date).getTime();
        //date = "2016-10-02";
        //keyword = "";
        //todo: +21 part of date?
        this.dataSource = "https://api.composer.nprstations.org/v1/widget/" + `${this.initialKey}/playlist?t=${curretTicks}&prog_id=${this.program_id}&limit=400&keywords=${keyword}&after=${date}+21%3A04%3A33&numQueryMonths=1&minScore=5&maxQueryAttempts=4&errorMsg=No+results+found.+Please+modify+yoursearch+and+try+again.`;
        this.gridComponent.bindDataSource(this.dataSource);
    }
}