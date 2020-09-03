import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services';
import { Router } from '@angular/router';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';


@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  currentUser = this.authenticationService.currentUserValue;
  subscriptionType = this.currentUser.subscriptionType;


  constructor(private authenticationService: AuthenticationService, private router: Router, private subscriptionsService: SubscriptionsService) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
  }

  goToSelectSubscription() {
    this.router.navigate(['./', { outlets: { view: ['select-subscription'] } }]);
  }

  cancelSubscription() {
    this.subscriptionsService.cancelSubscription().subscribe(result => console.log('subscription canceled ', result))
  }
}