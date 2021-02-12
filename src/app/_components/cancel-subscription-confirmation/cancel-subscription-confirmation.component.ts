import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubscriptionInfo, User } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';

@Component({
  selector: 'app-cancel-subscription-confirmation',
  templateUrl: './cancel-subscription-confirmation.component.html',
  styleUrls: ['./cancel-subscription-confirmation.component.scss']
})
export class CancelSubscriptionConfirmationComponent implements OnInit {

  currentUser: User = this.authenticationService.currentUserValue;

  constructor(public cancelSubscriptionRef: MatDialogRef<CancelSubscriptionConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public subscriptionInfo: SubscriptionInfo, public authenticationService: AuthenticationService, public subscriptionService: SubscriptionsService) { }

  ngOnInit(): void {
  }

  cancelSubscription() {
    this.subscriptionService.cancelSubscription().subscribe(result => {
      this.cancelSubscriptionRef.close(result);
    })
  }

}
