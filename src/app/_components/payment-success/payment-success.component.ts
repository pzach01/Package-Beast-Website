import { Component, OnInit } from '@angular/core';
import { SubscriptionInfo } from 'src/app/_models';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';
import { interval, Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
  subscription: Subscription;
  subscriptionInfo: SubscriptionInfo = new SubscriptionInfo;
  numberCheckSubscriptionAttempts = 15;
  displayErrorMessage = false;
  constructor(
    public subscriptionService: SubscriptionsService
  ) { }

  ngOnInit(): void {
    this.subscriptionInfo.subscriptionUpdateInProgress = true;
    // this.subscriptionService.getSubscriptionInfo().subscribe((subscriptionInfo) => this.subscriptionInfo = subscriptionInfo)
    // const source = interval(3500);
    const source = timer(0, 3500)
    const numAttempts = source.pipe(take(this.numberCheckSubscriptionAttempts))
    console.log(numAttempts)
    this.subscription = numAttempts.subscribe((i) => {
      if (i == this.numberCheckSubscriptionAttempts - 1) {
        this.displayErrorMessage = true
      } else {
        this.checkSubscription()
      }
    }
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkSubscription() {
    this.subscriptionService.getSubscriptionInfo().subscribe(subscriptionInfo => {
      this.subscriptionInfo = subscriptionInfo;
    })
  }

}
