import { Component, OnInit } from '@angular/core';
import { SubscriptionInfo } from 'src/app/_models';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';
import { interval, Subscription } from 'rxjs';


@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
  subscription: Subscription;
  subscriptionInfo: SubscriptionInfo = this.subscriptionService.currentSubscriptionInfoValue;
  constructor(public subscriptionService: SubscriptionsService) { }

  ngOnInit(): void {

    const source = interval(3500);
    this.subscription = source.subscribe(() => this.checkSubscription());
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkSubscription() {
    console.log("checking")
    this.subscriptionService.getSubscriptionInfo().subscribe(subscriptionInfo => {
      this.subscriptionInfo = subscriptionInfo;
      if (subscriptionInfo.userHasViewRights) {
        console.log("userHasViewRights")
      }
      console.log(subscriptionInfo);
    })
  }

}
