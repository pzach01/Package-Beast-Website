import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services';
import { Router } from '@angular/router';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';
import { SubscriptionInfo } from 'src/app/_models';


@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  currentUser = this.authenticationService.currentUserValue;
  subscriptionInfo: SubscriptionInfo = new SubscriptionInfo;


  constructor(private authenticationService: AuthenticationService, private router: Router, private subscriptionsService: SubscriptionsService) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
    this.subscriptionsService.getSubscriptionInfo().subscribe(subscriptionInfo => this.subscriptionInfo = subscriptionInfo)
  }

  goToSelectSubscription() {
    this.router.navigate(['./', { outlets: { view: ['select-subscription'] } }]);
  }

  goToUpdatePaymentMethod() {
    // this.router.navigate(['./', { outlets: { view: ['payment', 'standard'] } }]);
    this.router.navigate(['./', { outlets: { view: ['payment', 'update'] } }]);
  }

  cancelSubscription() {
    this.subscriptionsService.cancelSubscription().subscribe(result => {
      console.log('subscription canceled ', result);
      this.subscriptionsService.getSubscriptionInfo().subscribe(subscriptionInfo => this.subscriptionInfo = subscriptionInfo);
    })

  }
}