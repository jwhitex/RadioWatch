import { Component, OnInit } from '@angular/core';
import { IPhxRmtGridInit, IPhxRmtGridInitColumn } from '../../actions';
import { List } from 'immutable';
import { BehaviorSubject, Observable, Observer } from 'rxjs';

@Component({
    selector: 'npr-remote-grid',
    template: require('./npr-remote-grid.html')
})
export class PhalanxRemoteNprGridComponent implements OnInit {
    constructor() {
        this.dataSource$ = new BehaviorSubject<string>(this.calcDataSource(null));
        this.dataGetter$ = new Observable((observer) => {
            try {
                observer.next(this.dataExtractionProc);
                observer.complete();
            } catch(error) {
                observer.error(error);
            }
        });
    }
    dataSource$: BehaviorSubject<string>;
    dataGetter$: Observable<any>;

    dataExtractionProc = (x: any): [any, number] => {
        const noNan = (x) => typeof x !== "undefined" && x;
        const propTree = [
            "playlist",
            "playlist"
        ];
        if (noNan(x)) {
            const playList = x[propTree[0]]
            if (noNan(playList)) {
                const playList1 = playList[0];
                if (noNan(playList1)) {
                    const desiredData = playList1[propTree[1]];
                    if (noNan(desiredData))
                        return [desiredData, desiredData.length];
                    else {
                        return [playList, playList.length]
                    }
                }
            }
        }
        return [[], 0];
    };

    cols: List<IPhxRmtGridInitColumn> = List<IPhxRmtGridInitColumn>([
        { colName: "id", dataName: "id", sortable: true, visible: false, date_pipe: null },
        { colName: "Played", dataName: "_duration", sortable: true, visible: false, date_pipe: null },
        { colName: "Start", dataName: "_start_time", sortable: true, visible: false, date_pipe: "MM/dd/yyyy" },
        { colName: "Track", dataName: "trackName", sortable: true, visible: true, date_pipe: null },
        { colName: "Artist", dataName: "artistName", sortable: true, visible: true, date_pipe: null },
        { colName: "Collection", dataName: "collectionName", sortable: true, visible: true, date_pipe: null },
    ]);

    init: IPhxRmtGridInit = {
        id: 'exampleRemoteGrid',
        pageSize: 10,
        allowDelete: false,
        allowSorting: true,
        initialPage: 0,
        columns: this.cols
    }

    mode: string = "Get";
    searchFormModel = {
        queryDate: "",
        queryTerm: ""
    }

    ngOnInit() {
        this.searchFormModel.queryDate = this.getInitialDateForPicker();
    }

    onSubmit() {
        if (this.searchFormModel.queryTerm !== "") {
            this.dateSearch(this.searchFormModel.queryDate);
        } else {
            this.keywordDateSearch(this.searchFormModel.queryDate, this.searchFormModel.queryTerm);
        }
    }

    dateSearch(date: string) {
        this.dataSource$.next(this.calcDataSource({ date: date }));
    }

    keywordDateSearch(date: string, term: string) {
        this.dataSource$.next(this.calcDataSource({ date: date, keyword: term }));
    }

    calcDataSource(obj: any): string {
        const program_id = '52efef11e1c88f2f9b777447';
        const initialKey = '52efef04e1c88f2f9b77741b';
        const currentTicks = (new Date).getTime();

        if (!obj) {
            const date = this.getInitialDateForPicker();
            return "https://api.composer.nprstations.org/v1/widget/"
                + `${initialKey}/playlist?t=${currentTicks}&prog_id=${program_id}&datestamp=${date}`
                + "&order=1&errorMsg=No+results+found.+Please+modify+your+search+and+try+again.";
        } else if (!!obj.date && !!obj.keyword && obj.keyword !== "") {
            return "https://api.composer.nprstations.org/v1/widget/"
                + `${initialKey}/playlist?t=${currentTicks}&prog_id=${program_id}&limit=400&keywords=${obj.keyword}&after=${obj.date}`
                + "+21%3A04%3A33&numQueryMonths=1&minScore=5&maxQueryAttempts=4&errorMsg=No+results+found.+Please+modify+yoursearch+and+try+again.";
        } else if (!!obj.date) {
            return "https://api.composer.nprstations.org/v1/widget/"
                + `${initialKey}/playlist?t=${currentTicks}&prog_id=${program_id}&datestamp=${obj.date}`
                + "&order=1&errorMsg=No+results+found.+Please+modify+your+search+and+try+again.";
        } else {
            return ''
        }
    }

    //ui
    changeMode() {
        if (this.mode === 'Get') {
            this.mode = 'Getting';
        } else {
            this.mode = 'Get';
        }
    }

    //init
    private getInitialDateForPicker() {
        var clientDate = new Date();
        var timeAsString = this.timeAsESTString();
        var asInt = parseInt(timeAsString, 10);
        if (asInt < 10) {
            clientDate.setDate(clientDate.getDate() - 1);
        };
        return this.dateYFirst(clientDate);
    }

    //date extensions. swap for momentjs
    private timeAsESTString() {
        const clientDate = new Date();
        return (((clientDate.toLocaleTimeString("latn", { timeZone: "America/New_York" })).split(":"))[0]);
    }
    private dateYFirst(date: Date) {
        var day = date.getDate().toString();
        day = day.length === 1 ? `0${day}` : day;
        var month = (date.getMonth() + 1).toString(); //month is zero based!!
        month = month.length === 1 ? `0${month}` : month;
        return `${date.getFullYear()}-${month}-${day}`;
    }
    private dateMFirst(date: Date) {
        var day = date.getDate().toString();
        day = day.length === 1 ? `0${day}` : day;
        var month = date.getMonth().toString();
        month = month.length === 1 ? `0${month}` : month;
        return `${date.getMonth()}/${day}/${month}`;
    }
    private convertObjectReadable(date: string) {
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
}


