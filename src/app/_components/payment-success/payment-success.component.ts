import { Component, OnInit } from '@angular/core';
import { SubscriptionInfo } from 'src/app/_models';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
  subscriptionInfo: SubscriptionInfo = this.subscriptionService.currentSubscriptionInfoValue;

  constructor(public subscriptionService: SubscriptionsService) { }

  ngOnInit(): void {
    this.subscriptionService.getSubscriptionInfo().subscribe(currentSubscription => { this.subscriptionInfo = currentSubscription; console.log(currentSubscription) })
  }

}
