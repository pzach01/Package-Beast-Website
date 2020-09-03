import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-subscription',
  templateUrl: './select-subscription.component.html',
  styleUrls: ['./select-subscription.component.scss']
})
export class SelectSubscriptionComponent implements OnInit {

  currentUser = this.authenticationService.currentUserValue;
  subscriptionType = this.currentUser.subscriptionType;


  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
  }

  updateSubscriptionType(subscriptionType: string) {
    this.authenticationService.updateUser({
      subscriptionType: subscriptionType
    }).subscribe((r) => { this.subscriptionType = subscriptionType; this.router.navigate([{ outlets: { primary: 'dashboard', view: `payment/${subscriptionType}` } }]); })
  }
}
