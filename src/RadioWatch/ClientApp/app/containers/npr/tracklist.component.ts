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
    allowDelete = false;
    allowSort = true;
    gridName = 'trackListGrid';
    columnMeta: any = [
         { colName: "id", dataName:"id", sortable: true, visible: false },
         { colName: "Played", dataName: "_duration", sortable: true, visible: false},
         { colName: "Start", dataName: "_start_time", sortable: true, visible: true, date_pipe: "MM/dd/yyyy" },
         { colName: "Track", dataName: "trackName", sortable: true, visible: true },
         { colName: "Artist", dataName: "artistName", sortable: true, visible: true },
         { colName: "Collection", dataName: "collectionName", sortable: true, visible: false },
         { colName: "Youtube", sortable: true, visible: true, video: "youtube", searchBy:"trackName,artistName" }
         //{ colName: "buy", sortable: true, visible: true }
    ];
    dataSource: string;
    local: boolean = false;
    //future feature:
    //delayRead = true;
    
    searchFormModel = {
        queryDate: "",
        queryTerm: ""
    }

    mode: string = "Get";
    changeMode() {
        if (this.mode === 'Get') {
            this.mode = 'Getting';
        } else {
            this.mode = 'Get';
        }
    }

    initialKey: string = "52efef04e1c88f2f9b77741b";
    program_id: string = "52efef11e1c88f2f9b777447";
    constructor() {
        const curretTicks = (new Date).getTime();
        var clientDate = new Date();
        var timeAsString = (((clientDate.toLocaleTimeString("latn", { timeZone: "America/New_York" })).split(":"))[0]);
        var asInt = parseInt(timeAsString, 10);
        if (asInt < 10) {
            clientDate.setDate(clientDate.getDate() - 1);
        };
        const date = this.getDateAsStringQuery(clientDate);
        this.searchFormModel.queryDate = date;
        this.dataSource = "https://api.composer.nprstations.org/v1/widget/" + `${this.initialKey}/playlist?t=${curretTicks}&prog_id=${this.program_id}&datestamp=${date}&order=1&time=00%3A30&errorMsg=No+results+found.+Please+modify+your+search+and+try+again.`;
    }
    
    ngOnInit(): void {
        console.log(this.searchFormModel.queryDate);
    }

    //helper
    getDateAsStringQuery(date: Date) {
        var day = date.getDate().toString();
        day = day.length === 1 ? `0${day}` : day;
        var month = (date.getMonth() + 1).toString(); //month is zero based!!
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
    convertObjectReadable(date: string) {
        var dateParams = date.split("/");
        if (dateParams && dateParams.length === 3) {
            return dateParams[1] + "-" + dateParams[2] + "-" + dateParams[0];
        } else {
            dateParams = date.split("-");
            if (dateParams && dateParams.length === 3) {
                return dateParams[1] + "-" + dateParams[2] + "-" + dateParams[0];
            } else {
                console.log("error parsing date");
                //todo: add error handling...
                return "";
            }
        }
    }

    submitted = false;
    onSubmit() {
        //enforce date picker rules!
        
        if (this.searchFormModel.queryTerm && this.searchFormModel.queryTerm !== "") {
            //todo: validation on length of query term and fix..
            this.searchDateAndKeyword(this.searchFormModel.queryDate, this.searchFormModel.queryTerm);
        } else {
            this.searchDate(this.searchFormModel.queryDate);
        }
    }

      
    searchDate(date: string) {
        const curretTicks = (new Date).getTime();
        this.dataSource = "https://api.composer.nprstations.org/v1/widget/" + `${this.initialKey}/playlist?t=${curretTicks}&prog_id=${this.program_id}&datestamp=${date}&order=1&time=00%3A30&errorMsg=No+results+found.+Please+modify+your+search+and+try+again.`;
        this.gridComponent.bindDataSource(this.dataSource).subscribe(() => this.submitted = true);
    }

    searchDateAndKeyword(date: string, keyword: string) {
        const curretTicks = (new Date).getTime();
        
        //todo: +21 part of date?
        this.dataSource = "https://api.composer.nprstations.org/v1/widget/" + `${this.initialKey}/playlist?t=${curretTicks}&prog_id=${this.program_id}&limit=400&keywords=${keyword}&after=${date}+21%3A04%3A33&numQueryMonths=1&minScore=5&maxQueryAttempts=4&errorMsg=No+results+found.+Please+modify+yoursearch+and+try+again.`;
        this.gridComponent.bindDataSource(this.dataSource).subscribe(() => this.submitted = true);
    }
}