import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../_models/constants';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  constructor(private http: HttpClient) { }

  createSubscription(customerId: string, paymentMethodId: string, priceId: string): Observable<any> {
    return this.http.post<any>(`${Constants.API_BASE_URI}/payment/createStripeSubscription/`, { customerId, paymentMethodId, priceId });
  }
}
