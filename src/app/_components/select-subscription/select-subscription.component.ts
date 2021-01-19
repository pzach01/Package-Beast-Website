import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';
import { SubscriptionInfo } from 'src/app/_models';
import { MatDialog } from '@angular/material/dialog';
import { ReviewPaymentDialogComponent } from 'src/app/_components/review-payment-dialog/review-payment-dialog.component';
import { SubscriptionChange } from 'src/app/_models/subscription-change'
import { subscriptionType } from 'src/app/_models/subscription-info'
import { PaymentErrorDialogComponent } from '../payment-error-dialog/payment-error-dialog.component';

@Component({
  selector: 'app-select-subscription',
  templateUrl: './select-subscription.component.html',
  styleUrls: ['./select-subscription.component.scss']
})
export class SelectSubscriptionComponent implements OnInit {
  loading: boolean = false;
  subscriptionInfo: SubscriptionInfo = this.subscriptionService.currentSubscriptionInfoValue;
  subscriptionType: subscriptionType = this.subscriptionInfo.subscriptionType;
  selectedSubscriptionType: subscriptionType;
  selectedSubscriptionText: string;
  previousSubscriptionText: string;
  selectedSubscriptionPrice: number;
  previousSubscriptionPrice: number;
  stripeError: string = "";

  constructor(private router: Router, private subscriptionService: SubscriptionsService, public reviewPaymentDialog: MatDialog, public paymentErrorDialog: MatDialog) { }

  ngOnInit() {
    this.subscriptionService.getSubscriptionInfo().subscribe((subscriptionInfo) => {
      this.subscriptionInfo = subscriptionInfo;
      this.subscriptionType = this.subscriptionInfo.subscriptionType;
    })
  }

  openReviewPaymentDialog(subscriptionChange: SubscriptionChange): void {
    const dialogRef = this.reviewPaymentDialog.open(ReviewPaymentDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: subscriptionChange,
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (data.accept) {
          this.loading = true;
          const priceId = subscriptionChange.priceId
          this.updateSubscriptionType(subscriptionChange, priceId);
        }
      }
    });
  }

  openPaymentErrorDialog(error): void {
    const dialogRef = this.paymentErrorDialog.open(PaymentErrorDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: { error },
    });
  }

  selectSubscriptionType(selectedSubscriptionType: subscriptionType) {
    this.selectedSubscriptionType = selectedSubscriptionType;
    if (!this.subscriptionInfo.subscriptionActive) { this.subscriptionType = 'none' }
    const subscriptionChange = new SubscriptionChange(selectedSubscriptionType, this.subscriptionType)
    this.openReviewPaymentDialog(subscriptionChange);
  }

  updateSubscriptionType(subscriptionChange: SubscriptionChange, priceId) {

    if (this.subscriptionInfo.subscriptionActive) {
      this.subscriptionService.updateStripeSubscription(priceId).subscribe((r) => {
        if (subscriptionChange.direction == 'downgrade') {
          this.router.navigate(['./', { outlets: { view: ['subscription-downgrade-success'] } }]);
        } else {
          this.router.navigate(['./', { outlets: { view: ['payment-success'] } }]);
        }
      }, e => {
        console.log("error: ", e)
        this.loading = false;
        this.openPaymentErrorDialog(e)
      })
    } else if (!this.subscriptionInfo.subscriptionActive) {
      this.router.navigate([{ outlets: { primary: 'dashboard', view: `payment/${subscriptionChange.selectedSubscriptionType}` } }]);
    }
  }
}
