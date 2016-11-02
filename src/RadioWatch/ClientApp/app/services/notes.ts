import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { StoreHelper } from '../stores/_addenda';
//what is rxjs/Rx
import 'rxjs/Rx';

@Injectable()
export class NoteService {
    path: string = '/api/notes/values'

    constructor(private apiService: ApiService,
                private storeHelper: StoreHelper) {
    }

    createNote(note) {
        return this.apiService.post(this.path, note)
        .do(res => this.storeHelper.add('notes', res))
    }

    getNotes() {
        return this.apiService.get(this.path)
        .do(res => this.storeHelper.update('notes', res))
    }

    completeNote(note) {
        return this.apiService.delete(`${this.path}/${note.id}`)
              .do(res => this.storeHelper.findAndDelete('notes', res.id));
    }
}
