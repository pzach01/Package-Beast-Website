import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services';
import { Router } from '@angular/router';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';
import { SubscriptionInfo } from 'src/app/_models';

@Component({
  selector: 'app-select-subscription',
  templateUrl: './select-subscription.component.html',
  styleUrls: ['./select-subscription.component.scss']
})
export class SelectSubscriptionComponent implements OnInit {

  subscriptionInfo = new SubscriptionInfo
  currentUser = this.authenticationService.currentUserValue;
  subscriptionType = this.currentUser.subscriptionType;
  priceId: string;

  constructor(private authenticationService: AuthenticationService, private router: Router, private subscriptionService: SubscriptionsService) { }

  ngOnInit() {
    this.subscriptionService.getSubscriptionInfo().subscribe((subscriptionInfo) => this.subscriptionInfo = subscriptionInfo)
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
  }

  updateSubscriptionType(subscriptionType: string) {
    switch (subscriptionType) {
      case "standard":
        this.subscriptionType = "standard"
        this.priceId = "price_1HPJLlJWFTMXIZUoMH26j2EB";
        break;
      case "premium":
        this.subscriptionType = "standard"
        this.priceId = "price_1HPJNoJWFTMXIZUo60gNaXlm";
        break;
      case "beastMode":
        this.subscriptionType = "beastMode"
        this.priceId = "price_1HPJOLJWFTMXIZUoGcXhTnax";
        break;
    }

    if (this.subscriptionInfo.subscriptionActive) {
      this.subscriptionService.updateStripeSubscription(this.priceId).subscribe((r) => {
        console.log("response from update Stripe Subscription", r)
        this.router.navigate(['./', { outlets: { view: ['payment-success'] } }]);
      })
    } else {
      this.router.navigate([{ outlets: { primary: 'dashboard', view: `payment/${subscriptionType}` } }]);
    }

  }

}
