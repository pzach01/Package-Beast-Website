import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services';


@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  currentUser = this.authenticationService.currentUserValue;
  subscriptionType = this.currentUser.subscriptionType;


  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
  }

  updateSubscriptionType(subscriptionType: string) {
    this.authenticationService.updateUser({
      subscriptionType: subscriptionType
    }).subscribe((r) => { (console.log(r)); this.subscriptionType = subscriptionType })
  }
}