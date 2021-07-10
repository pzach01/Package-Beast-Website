import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShippoAuthenticationService {

  private currentShippoAccessTokenSubject: BehaviorSubject<string>;
  public currentShippoAccessToken: Observable<string>;

  constructor(private http: HttpClient) {
    this.currentShippoAccessTokenSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('currentShippoAccessToken')));
    this.currentShippoAccessToken = this.currentShippoAccessTokenSubject.asObservable();
  }

  authenticate(code: string) {
    return this.http.post<any>(`${environment.API_BASE_URI}/shippo-oauth-access-token/`, { code })
      .pipe(map(res => {
        if (res.access_token) {
          // store user token in local storage to use for future shippo api calls
          localStorage.setItem('currentShippoAccessToken', JSON.stringify(res.access_token));
          this.currentShippoAccessTokenSubject.next(res.access_token);
        }
        console.log('res from shippo-auth-service', res)
        return res;
      }));
  }

}
