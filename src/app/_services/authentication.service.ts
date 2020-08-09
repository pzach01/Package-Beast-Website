﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models';
import { Token } from '../_models';
import { Constants } from 'src/app/_models/constants'


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    Token: String;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private currentTokenSubject: BehaviorSubject<Token>;
    public currentToken: Observable<Token>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.currentTokenSubject = new BehaviorSubject<Token>(JSON.parse(localStorage.getItem('currentToken')));
        this.currentToken = this.currentTokenSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    public get currentTokenValue(): Token {
        return this.currentTokenSubject.value;
    }

    register(email, first_name, last_name, password1, password2) {
        return this.http.post<any>(`${Constants.API_BASE_URI}/accounts/registration/`, { email, first_name, last_name, password1, password2 })
            .pipe(map(token => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentToken', JSON.stringify(token));
                this.currentTokenSubject.next(token);
                return token;
            }));
    }

    login(email, password) {
        return this.http.post<any>(`${Constants.API_BASE_URI}/accounts/login/`, { email, password })
            .pipe(map(token => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentToken', JSON.stringify(token));
                this.currentTokenSubject.next(token);
                return token;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        // remove token from local storage and set current token to null
        localStorage.removeItem('currentToken');
        this.currentTokenSubject.next(null);
    }

    sendPasswordResetEmail(email) {
        return this.http.post<any>(`${Constants.API_BASE_URI}/accounts/password/reset/`, { email })
            .pipe(map(message => {
                return message;
            }));
    }

    resetPassword(uid, token, new_password1, new_password2) {
        return this.http.post<any>(`${Constants.API_BASE_URI}/accounts/password/reset/confirm/`, { uid, token, new_password1, new_password2 })
            .pipe(map(message => {
                return message;
            }));
    }

    getUser() {
        return this.http.get<User>(`${Constants.API_BASE_URI}/accounts/user/`)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    updateUser(user: Partial<User>) {
        return this.http.patch(`${Constants.API_BASE_URI}/accounts/user/`, user)
            .pipe(map((u: User) => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(u));
                this.currentUserSubject.next(u);
                return u;
            }));
    }
}