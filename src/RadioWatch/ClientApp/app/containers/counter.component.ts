import { Component } from '@angular/core';

@Component({
    selector: 'counter',
    template: require('./counter.component.html')
})
export class CounterComponent {
    public currentCount = 0;

    public incrementCounter() {
        this.currentCount++;
    }

    test(e): void {
        var c =
            { id: "581a99b8f8dde0e91c998a60", _duration: 235507, _start_time: "11-02-2016 20:35:42", trackName: "High Time", artistName: "Seth Walker", collectionName: "Gotta Get Back", buy: {} }
        debugger;
        var col = {
            colName: "Collection",
            dataName: "Youtube",
            sortable: true,
            visible: true,
            video: "youtube",
            searchBy: "trackName,artistName"
        };
        var result = col.searchBy ? (() => { let termKeys = col.searchBy.split(','); let terms = termKeys.map((x) => c[x]); return terms.join(' '); }).call([]) : 'rick and morty everyone dies';
        debugger;
        console.log(result);
    }
}
