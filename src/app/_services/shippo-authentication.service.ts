import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShippoAuthenticationService {

  private currentShippoAccessTokenSubject: BehaviorSubject<string>;
  public currentShippoAccessToken: Observable<string>;
  private currentShippoRandomStringSubject: BehaviorSubject<string>;
  public currentShippoRandomString: Observable<string>;

  constructor(private http: HttpClient) {
    this.currentShippoAccessTokenSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('currentShippoAccessToken')));
    this.currentShippoAccessToken = this.currentShippoAccessTokenSubject.asObservable();
    this.currentShippoRandomStringSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('currentShippoRandomString')));
    this.currentShippoRandomString = this.currentShippoRandomStringSubject.asObservable();
  }

  public get currentShippoRandomStringValue(): string {
    return this.currentShippoRandomStringSubject.value;
  }

  createShippoRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    localStorage.setItem('currentShippoRandomString', JSON.stringify(result));
    this.currentShippoRandomStringSubject.next(result);
    return result;
  }

  authenticate(code: string) {
    return this.http.post<any>(`${environment.API_BASE_URI}/shippo-oauth-access-token/`, { code })
      .pipe(map(res => {
        if (res.access_token) {
          // store user token in local storage to use for future shippo api calls
          localStorage.setItem('currentShippoAccessToken', JSON.stringify(res.access_token));
          this.currentShippoAccessTokenSubject.next(res.access_token);
        }
        console.log('response from shippo-auth-service', res)
        return res;
      }));
  }

  createTransaction(rateId: string, labelFileType: string) {
    return this.http.post<any>(`${environment.API_BASE_URI}/shippo-transaction/`, { rateId, labelFileType })
  }

  cancelTransaction() { }
}
