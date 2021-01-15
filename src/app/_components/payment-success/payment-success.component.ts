import { Component, OnInit } from '@angular/core';
import { SubscriptionInfo } from 'src/app/_models';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
  subscription: Subscription;
  subscriptionInfo: SubscriptionInfo = new SubscriptionInfo;
  numberCheckSubscriptionAttempts = 20;
  constructor(
    public subscriptionService: SubscriptionsService
  ) { }

  ngOnInit(): void {
    this.subscriptionService.getSubscriptionInfo().subscribe((subscriptionInfo) => this.subscriptionInfo = subscriptionInfo)
    const source = interval(3500);
    const numAttempts = source.pipe(take(this.numberCheckSubscriptionAttempts))
    this.subscription = numAttempts.subscribe((i) => this.checkSubscription(i));
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkSubscription(i) {
    this.subscriptionService.getSubscriptionInfo().subscribe(subscriptionInfo => {
      this.subscriptionInfo = subscriptionInfo;
    })
  }

}
