import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../_models/constants';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  constructor(private http: HttpClient) { }

  retrySubscription(paymentMethodId: string): Observable<any> {
    return this.http.post<any>(`${Constants.API_BASE_URI}/payment/retryStripeSubscription/`, { paymentMethodId });
  }

  createSubscription(paymentMethodId: string, priceId: string): Observable<any> {
    return this.http.post<any>(`${Constants.API_BASE_URI}/payment/createStripeSubscription/`, { paymentMethodId, priceId });
  }

  checkUserHasStripeSubscription(): Observable<any> {
    return this.http.get<any>(`${Constants.API_BASE_URI}/payment/userHasStripeSubscription/`);
  }

  cancelSubscription(): Observable<any> {
    return this.http.delete<any>(`${Constants.API_BASE_URI}/payment/cancelStripeSubscription/`);
  }
}
