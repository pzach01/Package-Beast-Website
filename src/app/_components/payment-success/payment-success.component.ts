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
  subscriptionInfo: SubscriptionInfo;
  numberCheckSubscriptionAttempts = 15;
  subscriptionUpdateInProgress = true;
  displayErrorMessage = false;
  checkSubscription$: Subscription
  constructor(
    public subscriptionService: SubscriptionsService
  ) { }

  ngOnInit(): void {
    // const source = interval(3500);
    const source = interval(3500)
    const numAttempts = source.pipe(take(this.numberCheckSubscriptionAttempts))
    console.log(numAttempts)
    this.checkSubscription$ = numAttempts.subscribe((i) => {
      if (i == this.numberCheckSubscriptionAttempts - 1) {
        if (this.subscriptionUpdateInProgress) {
          this.displayErrorMessage = true
        }

      } else {
        this.checkSubscription()
      }
    }
    );
  }
  ngOnDestroy() {
    this.checkSubscription$.unsubscribe()
  }


  checkSubscription() {
    this.subscriptionService.getSubscriptionInfo().subscribe(subscriptionInfo => {
      this.subscriptionInfo = subscriptionInfo;
      this.subscriptionUpdateInProgress = subscriptionInfo.subscriptionUpdateInProgress
      if (!this.subscriptionUpdateInProgress) {
        this.checkSubscription$.unsubscribe()
      }
    })
  }

}
