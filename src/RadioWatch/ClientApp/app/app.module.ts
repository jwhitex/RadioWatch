import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { providers } from './app.providers';
//import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    AboutComponent,
    //PhalanxGridExampleComponent,
    PhalanxRemoteNprGridComponent,
    //TestDisplayComponent
} from './components';
import { containerDeclarations } from './app.declarations';
import { NgReduxModule } from 'ng2-redux';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        ...containerDeclarations,
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        FormsModule,
        NgReduxModule.forRoot(),
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'evening-music', component: PhalanxRemoteNprGridComponent },
            { path: 'about', component: AboutComponent },
            //{ path: 'example', component: PhalanxGridExampleComponent },
            //{ path: 'test', component: TestDisplayComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [
        ...providers
    ]
})
export class AppModule {
}
