import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services';
import { Router } from '@angular/router';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';

@Component({
  selector: 'app-select-subscription',
  templateUrl: './select-subscription.component.html',
  styleUrls: ['./select-subscription.component.scss']
})
export class SelectSubscriptionComponent implements OnInit {

  currentUser = this.authenticationService.currentUserValue;
  subscriptionType = this.currentUser.subscriptionType;
  priceId: string;

  constructor(private authenticationService: AuthenticationService, private router: Router, private subscriptionService: SubscriptionsService) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
  }

  updateSubscriptionType(subscriptionType: string) {
    switch (subscriptionType) {
      case "standard":
        this.priceId = "price_1HPJLlJWFTMXIZUoMH26j2EB";
        break;
      case "premium":
        this.priceId = "price_1HPJNoJWFTMXIZUo60gNaXlm";
        break;
      case "beastMode":
        this.priceId = "price_1HPJOLJWFTMXIZUoGcXhTnax";
        break;
    }
    this.subscriptionService.updateStripeSubscription(this.priceId).subscribe((r) => {
      console.log("response from update Stripe Subscription", r)
      this.router.navigate(['./', { outlets: { view: ['payment-success'] } }]);

      // this.router.navigate([{ outlets: { primary: 'dashboard', view: `payment/${subscriptionType}` } }]); 
    })

  }

}
