import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../_models/constants';
import { SubscriptionInfo } from '../_models'


@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  constructor(private http: HttpClient) { }

  retrySubscription(paymentMethodId: string): Observable<any> {
    return this.http.post<any>(`${Constants.API_BASE_URI}/payment/retryInvoice/`, { paymentMethodId });
  }

  createSubscription(paymentMethodId: string, priceId: string): Observable<any> {
    return this.http.post<any>(`${Constants.API_BASE_URI}/payment/createStripeSubscription/`, { paymentMethodId, priceId });
  }

  getSubscripionInfo(): Observable<SubscriptionInfo> {
    return this.http.get<SubscriptionInfo>(`${Constants.API_BASE_URI}/payment/getSubscriptionInfo/`);
  }

  updateStripeSubscription(priceId: string): Observable<any> {
    console.log("priceId", priceId)
    return this.http.put<any>(`${Constants.API_BASE_URI}/payment/updateStripeSubscription/`, { priceId });
  }

  checkUserHasStripeSubscription(): Observable<any> {
    return this.http.get<any>(`${Constants.API_BASE_URI}/payment/userHasStripeSubscription/`);
  }

  cancelSubscription(): Observable<any> {
    return this.http.delete<any>(`${Constants.API_BASE_URI}/payment/cancelStripeSubscription/`);
  }
}
