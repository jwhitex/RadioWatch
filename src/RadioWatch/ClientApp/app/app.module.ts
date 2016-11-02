import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { providers } from './app.providers';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import {
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    FetchDataComponent,
    CounterComponent,
    PlayListComponent,
} from './containers/_addenda';
import { containerDeclarations } from './app.declarations';
import { PhalanxGridComponent, PhalanxGridColumnComponent } from './ui/_addenda';
import { AutoGridSortPipe } from './pipes/_addenda';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        ...containerDeclarations,
        PhalanxGridComponent,
        PhalanxGridColumnComponent,
        AutoGridSortPipe
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: 'playlist', component: PlayListComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [
        ...providers
    ]
    //{ provide: LocationStrategy, useClass: HashLocationStrategy },
})
export class AppModule {
}
