import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SubscriptionInfo } from '../_models'
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  private currentSubscriptionInfoSubject: BehaviorSubject<SubscriptionInfo>;
  public currentSubscriptionInfo: Observable<SubscriptionInfo>;

  constructor(private http: HttpClient) {
    this.currentSubscriptionInfoSubject = new BehaviorSubject<SubscriptionInfo>(JSON.parse(localStorage.getItem('currentSubscriptionInfo')));
    this.currentSubscriptionInfo = this.currentSubscriptionInfoSubject.asObservable();
  }

  public get currentSubscriptionInfoValue(): SubscriptionInfo {
    return this.currentSubscriptionInfoSubject.value;
  }

  retrySubscription(paymentMethodId: string): Observable<any> {
    return this.http.post<any>(`${environment.API_BASE_URI}/payment/retryInvoice/`, { paymentMethodId });
  }

  createSubscription(paymentMethodId: string, priceId: string): Observable<any> {
    return this.http.post<any>(`${environment.API_BASE_URI}/payment/createStripeSubscription/`, { paymentMethodId, priceId });
  }

  getSubscriptionInfo(): Observable<SubscriptionInfo> {
    return this.http.get<SubscriptionInfo>(`${environment.API_BASE_URI}/payment/getSubscriptionInfo/`)
      .pipe(map(subscriptionInfo => {
        // store subscription details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentSubscriptionInfo', JSON.stringify(subscriptionInfo));
        this.currentSubscriptionInfoSubject.next(subscriptionInfo);
        console.log("hey, Pedro subscriptionInfo:", subscriptionInfo)
        console.log("hey, Pedro subscriptionInfoValue:", this.currentSubscriptionInfoValue)
        return subscriptionInfo;
      }));
  }

  updateStripeSubscription(priceId: string): Observable<any> {
    console.log("priceId", priceId)
    return this.http.put<any>(`${environment.API_BASE_URI}/payment/updateStripeSubscription/`, { priceId });
  }

  checkUserHasStripeSubscription(): Observable<any> {
    return this.http.get<any>(`${environment.API_BASE_URI}/payment/userHasStripeSubscription/`);
  }

  cancelSubscription(): Observable<any> {
    return this.http.delete<any>(`${environment.API_BASE_URI}/payment/cancelStripeSubscription/`);
  }
}
