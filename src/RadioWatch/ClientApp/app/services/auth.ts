import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {ApiService} from './api';
// import { Store, StoreHelper } from '../../stores/_addenda';

// @Injectable()
// export class AuthService implements CanActivate {
//     JWT_KEY: string = 'retain_token';

//     //this is buggy... so if signout then clear from local storage but /auth will create a new one of these... and then populate local storage with key...
//     //perhaps have di setup wrong??
//     constructor(private router: Router, private apiService: ApiService, private storeHelper: StoreHelper, private store: Store) {
//         this.setJwt(window.localStorage.getItem(this.JWT_KEY));
//     }

//     setJwt(jwt: string) {
//         //had to add !== null..
//         if (jwt !== null) {
//             window.localStorage.setItem(this.JWT_KEY, jwt);
//             this.apiService.setHeaders({ Authorization: `Bearer ${jwt}` });
//         }
//     }

//     authenticate(path, creds) {
//         return this.apiService.post(`/${path}`, creds)
//             .do(res => this.setJwt(res.token))
//             .do(res => this.storeHelper.update('user', res.data))
//             .map(res => res.data);
//     }

//     signOut() {
//         window.localStorage.removeItem(this.JWT_KEY);
//         this.store.purge();
//         this.router.navigate(['', 'auth']);
//     }

//     isAuthorized(): boolean {
//         return Boolean(window.localStorage.getItem(this.JWT_KEY))
//     }

//     canActivate(): boolean {
//         const isAuth = this.isAuthorized();
//         if (!isAuth)
//             this.router.navigate(['', 'auth']);
//         return isAuth;
//     }
// }