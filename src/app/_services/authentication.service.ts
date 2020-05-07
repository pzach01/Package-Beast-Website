import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models';
import { Token } from '../_models';


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

    login(email, password) {
        console.log("login,hi")
        console.log(email, password)
        return this.http.post<any>(`http://packageapp-env.pumdxt3sbe.us-east-1.elasticbeanstalk.com/accounts/login/`, { email, password })
            .pipe(map(token => {
                console.log("your token:", token);
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

    getUser(token) {
        console.log("hello from getuser")
        // const httpOptions = {
        //     headers: new HttpHeaders({
        //       'Content-Type': 'application/json',
        //       'Authorization': `Token ${token.key}`
        //     })
        //   };
        return this.http.get<User>(`http://packageapp-env.pumdxt3sbe.us-east-1.elasticbeanstalk.com/accounts/user/`)
            .pipe(map(user => {
                console.log("Sup, User")
                console.log(user);
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }
}