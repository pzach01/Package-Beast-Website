import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services';
import { Router } from '@angular/router';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';
import { SubscriptionInfo, User } from 'src/app/_models';
import { MatDialog } from '@angular/material/dialog';
import { CancelSubscriptionConfirmationComponent } from 'src/app/_components/cancel-subscription-confirmation/cancel-subscription-confirmation.component'



@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  currentUser: User = this.authenticationService.currentUserValue;
  subscriptionInfo: SubscriptionInfo = this.subscriptionsService.currentSubscriptionInfoValue


  constructor(private authenticationService: AuthenticationService, private router: Router, private subscriptionsService: SubscriptionsService, public confirmSubscriptionCancelation: MatDialog) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
    this.subscriptionsService.getSubscriptionInfo().subscribe(subscriptionInfo => {
      this.subscriptionInfo = subscriptionInfo; console.log("subscriptionInfo", subscriptionInfo);

    })
  }

  goToSelectSubscription() {
    this.router.navigate(['./', { outlets: { view: ['select-subscription'] } }]);
  }

  goToUpdatePaymentMethod() {
    this.router.navigate(['./', { outlets: { view: ['payment', 'update'] } }]);
  }

  openConfirmSubscriptionCancelation(): void {
    const dialogRef = this.confirmSubscriptionCancelation.open(CancelSubscriptionConfirmationComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: this.subscriptionInfo
    });

    dialogRef.afterClosed().subscribe((subscriptionInfo: SubscriptionInfo) => {
      if (subscriptionInfo) {
        console.log("sub returned", subscriptionInfo)
        this.subscriptionsService.getSubscriptionInfo().subscribe((subscriptionInfo) => this.subscriptionInfo = subscriptionInfo)
      }
    });
  }

  //cancelSubscription() {
  // this.subscriptionsService.cancelSubscription().subscribe(result => {
  //   console.log('subscription canceled ', result);
  //   this.subscriptionsService.getSubscriptionInfo().subscribe(subscriptionInfo => this.subscriptionInfo = subscriptionInfo);
  // })
  //this.openConfirmSubscriptionCancelation()
  //}
}