import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';
import { SubscriptionInfo } from 'src/app/_models';

@Component({
  selector: 'app-select-subscription',
  templateUrl: './select-subscription.component.html',
  styleUrls: ['./select-subscription.component.scss']
})
export class SelectSubscriptionComponent implements OnInit {

  subscriptionInfo: SubscriptionInfo = this.subscriptionService.currentSubscriptionInfoValue;
  subscriptionType: string = this.subscriptionInfo.subscriptionType;
  priceId: string;

  constructor(private router: Router, private subscriptionService: SubscriptionsService) { }

  ngOnInit() {
    this.subscriptionService.getSubscriptionInfo().subscribe((subscriptionInfo) => {
      this.subscriptionInfo = subscriptionInfo;
      this.subscriptionType = this.subscriptionInfo.subscriptionType
    })
  }

  updateSubscriptionType(subscriptionType: string) {
    switch (subscriptionType) {
      case "standard":
        this.subscriptionType = "standard"
        this.priceId = "price_1HPJLlJWFTMXIZUoMH26j2EB";
        break;
      case "premium":
        this.subscriptionType = "premium"
        this.priceId = "price_1HPJNoJWFTMXIZUo60gNaXlm";
        break;
      case "beastMode":
        this.subscriptionType = "beastMode"
        this.priceId = "price_1HPJOLJWFTMXIZUoGcXhTnax";
        break;
    }

    if (this.subscriptionInfo.subscriptionType == 'none') {
      this.router.navigate(['./', { outlets: { view: ['billing'] } }]);
    }

    if (this.subscriptionInfo.subscriptionActive && this.subscriptionInfo.subscriptionType != 'none') {
      this.subscriptionService.updateStripeSubscription(this.priceId).subscribe((r) => {
        console.log("response from update Stripe Subscription", r)
        this.router.navigate(['./', { outlets: { view: ['payment-success'] } }]);
      })
    } else if (!this.subscriptionInfo.subscriptionActive && this.subscriptionInfo.subscriptionType != 'none') {
      this.router.navigate([{ outlets: { primary: 'dashboard', view: `payment/${subscriptionType}` } }]);
    }

  }

}
