import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/observable/throw';
let config = require('config');

@Injectable()
export class ApiService {
    headers: Headers = new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json'
    });
    options: RequestOptions = new RequestOptions({ headers: this.headers });

    //todo: set global config..
    api_url: string = config.baseUrl;

    //bind to context of the class 'http'
    constructor(private http: Http){     
    }

    private getJson(response: Response){
        return response.json();
    }

    private checkForError(response: Response): Response {
        if (response.status >= 200 && response.status < 300){
            return response;
        }
        else{
            var error = new Error(response.statusText);
            error['response'] = response;
            console.error(error);
            throw error;
        }
    }

    get(path: string): Observable<any> {
        return this.http.get(`${this.api_url}${path}`, this.options)
            .map(this.checkForError)
            .catch(err => Observable.throw(err))
            .map(this.getJson);
    }

    getExternal(url: string): Observable<any> {
        return this.http.get(`${url}`, this.options)
            .map(this.checkForError)
            .catch(err => Observable.throw(err))
            .map(this.getJson);
    }

    post(path: string, body: any): Observable<any> {
        return this.http.post(
            `${this.api_url}${path}`,
            JSON.stringify(body),
            this.options)
        .map(this.checkForError)
        .catch(err => Observable.throw(err))
        .map(this.getJson)
    }

    delete(path: string): Observable<any> {
        return this.http.delete(`${this.api_url}${path}`, this.options)
            .map(this.checkForError)
            .catch(err => Observable.throw(err))
            .map(this.getJson);
    }

    setHeaders(headers){
        Object.keys(headers).forEach(header => this.headers.set(header, headers[header]))
        //optimize
        this.options = new RequestOptions({ headers: this.headers });
    }
}