import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { IPhxRmtGridInit, IPhxRmtGridInitColumn } from '../../actions';
import { select } from 'ng2-redux';
import { List } from 'immutable';
import { BehaviorSubject, Observable, Observer, Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
    selector: 'npr-remote-grid',
    providers: [AsyncPipe],
    templateUrl: './npr-remote-grid.html',
    styleUrls: ['./npr-remote-grid.css'],
})
export class PhalanxRemoteNprGridComponent implements OnInit, OnDestroy {
    @select(['phxRmtGrid', 'action']) action$: Observable<string>;
    @select(['phxRmtGrid', 'extraData']) extraData$: Observable<string>;

    nprQueryForm: FormGroup;

    dateValidator() : ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} => {
            const queryDate = control.value;
            if (!moment(queryDate).isValid())
                return {'invalidDate': {queryDate}}
            return null;
        };
    }

    buildForm(): void {
        this.nprQueryForm = this.fb.group({
        'queryDate': [this.searchFormModel.queryDate,
            [ 
                Validators.required,
                this.dateValidator()
            ]
        ],
        'queryTerm': [this.searchFormModel.queryTerm]
        });

        this.nprQueryForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged(data? : any) {
        if (!this.nprQueryForm) { return; }
        const form = this.nprQueryForm;
        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    validationMessages = {
        'queryDate': {
            'required' : 'Date is required',
            'invalidDate' : "Date is invalid."
        },
        'queryTerm': {}
    }

    formErrors = {
        'queryDate': '',
        'queryTerm': ''
    };

    searchFormModel = {
        queryDate: "",
        queryTerm: ""
    }

    extraDataSubject$: BehaviorSubject<any>;
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
    
    subscriptions: List<Subscription>;
    constructor(private fb: FormBuilder) {
    }

    cols: List<IPhxRmtGridInitColumn> = List<IPhxRmtGridInitColumn>([
        { colName: "id", dataName: "id", sortable: true, visible: false, date_pipe: null },
        { colName: "Played", dataName: "_duration", sortable: true, visible: false, date_pipe: null },
        { colName: "Track", dataName: "trackName", sortable: true, visible: true, date_pipe: null },
        { colName: "Artist", dataName: "artistName", sortable: true, visible: true, date_pipe: null },
        { colName: "Collection", dataName: "collectionName", sortable: true, visible: true, date_pipe: null },
        { colName: "Date", dataName: "_start_time", sortable: true, visible: true, date_pipe: "MM/dd/yyyy" },
    ]);

    init: IPhxRmtGridInit = {
        id: 'exampleRemoteGrid',
        pageSize: 10,
        allowDelete: false,
        allowSorting: true,
        initialPage: 0,
        columns: this.cols
    }

    ngOnInit() {
        this.buildForm();
        this.subscriptions = List<Subscription>([]);
        this.subscriptions = this.subscriptions.push(this.extraData$.subscribe((next) => {
            if (next !== undefined && next) {
                let queryKeys = JSON.parse(next);
                if (queryKeys !== undefined && queryKeys && JSON.stringify(queryKeys) !== '{}') {
                    const form = this.nprQueryForm;
                    this.searchFormModel.queryDate = queryKeys.queryDate;
                    this.searchFormModel.queryTerm = queryKeys.queryTerm; //needed?
                    let control_queryDate = form.get("queryDate");
                    let control_queryTerm = form.get("queryTerm");
                    control_queryDate.setValue(queryKeys.queryDate);
                    control_queryTerm.setValue(queryKeys.queryTerm);
                    if (!this.dataSource$) {
                        this.dataSource$ = new BehaviorSubject<string>(this.calcDataSource(queryKeys.queryDate, queryKeys.queryTerm));
                    }
                } else {
                    if (!this.dataSource$) {
                        this.dataSource$ = new BehaviorSubject<string>(this.calcDataSource(null));
                        const form = this.nprQueryForm;
                        let control_queryDate = form.get("queryDate");
                        control_queryDate.setValue(queryKeys.queryDate);
                        this.searchFormModel.queryDate = this.getInitialDateForPicker();
                    }
                }
            }
        }));
        this.dataGetter$ = new Observable((observer) => {
            try {
                observer.next(this.dataExtractionProc);
                observer.complete();
            } catch (error) {
                observer.error(error);
            }
        });
        this.extraDataSubject$ = new BehaviorSubject<any>({});
    }

    onSubmit() {
        let date = this.nprQueryForm.get("queryDate");
        let term = this.nprQueryForm.get("queryTerm");
        if (term.value !== "" && !isNaN(term.value)) {
            this.keywordDateSearch(date.value, term.value);
        } else {
            this.dateSearch(date.value);
        }
        this.extraDataSubject$.next({ queryDate: date.value, queryTerm: term.value });
    }

    dateSearch(date: string) {
        this.dataSource$.next(this.calcDataSource( date ));
    }

    keywordDateSearch(date: string, term: string) {
        this.dataSource$.next(this.calcDataSource(date, term ));
    }

    calcDataSource(date: string, keyword?: string): string {
        const program_id = '52efef11e1c88f2f9b777447';
        const initialKey = '52efef04e1c88f2f9b77741b';
        const currentTicks = (new Date).getTime();
        var formattedDate = this.dateYFirst(new Date(date))

        if (!date || !formattedDate || formattedDate=="") {
            const today = this.getInitialDateForPicker();
            return "https://api.composer.nprstations.org/v1/widget/"
                + `${initialKey}/playlist?t=${currentTicks}&prog_id=${program_id}&datestamp=${today}`
                + "&order=1&errorMsg=No+results+found.+Please+modify+your+search+and+try+again.";
        } else if (!!formattedDate && !!keyword && keyword !== "") {
            return "https://api.composer.nprstations.org/v1/widget/"
                + `${initialKey}/playlist?t=${currentTicks}&prog_id=${program_id}&limit=400&keywords=${keyword}&after=${formattedDate}`
                + "+21%3A04%3A33&numQueryMonths=1&minScore=5&maxQueryAttempts=4&errorMsg=No+results+found.+Please+modify+yoursearch+and+try+again.";
        } else if (!!formattedDate) {
            return "https://api.composer.nprstations.org/v1/widget/"
                + `${initialKey}/playlist?t=${currentTicks}&prog_id=${program_id}&datestamp=${formattedDate}`
                + "&order=1&errorMsg=No+results+found.+Please+modify+your+search+and+try+again.";
        } else {
            return ''
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach((value) => value.unsubscribe());
    }

    //init
    private getInitialDateForPicker() {
        let clientDate = new Date();
        let timeAsString = this.timeAsESTString();
        let asInt = parseInt(timeAsString, 10);
        if (asInt < 10) {
            clientDate.setDate(clientDate.getDate() - 1);
        };
        return this.dateYFirst(clientDate);
    }

    //date extensions. swap for momentjs
    private timeAsESTString() {
        const clientDate = new Date();
        let formatOptions = { timeZone: "America/New_York" };
        try {
            return (((clientDate.toLocaleTimeString("latn", formatOptions)).split(":"))[0]);
        } catch (ex) {
            formatOptions = { timeZone: "UTC" };
            return (((clientDate.toLocaleTimeString("latn", formatOptions)).split(":"))[0]);
        }
    }
    private dateYFirst(date: Date) {
        let day = date.getDate().toString();
        day = day.length === 1 ? `0${day}` : day;
        let month = (date.getMonth() + 1).toString(); //month is zero based!!
        month = month.length === 1 ? `0${month}` : month;
        return `${date.getFullYear()}-${month}-${day}`;
    }
    private dateMFirst(date: Date) {
        let day = date.getDate().toString();
        day = day.length === 1 ? `0${day}` : day;
        let month = date.getMonth().toString();
        month = month.length === 1 ? `0${month}` : month;
        return `${date.getMonth()}/${day}/${month}`;
    }
    private convertObjectReadable(date: string) {
        let dateParams = date.split("/");
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