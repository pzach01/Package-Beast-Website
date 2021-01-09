import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';
import { SubscriptionInfo } from 'src/app/_models';
import { MatDialog } from '@angular/material/dialog';
import { ReviewPaymentDialogComponent } from 'src/app/_components/review-payment-dialog/review-payment-dialog.component';
import { SubscriptionChange } from 'src/app/_models/subscription-change'
import { subscriptionType } from 'src/app/_models/subscription-info'

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

  constructor(private router: Router, private subscriptionService: SubscriptionsService, public reviewPaymentDialog: MatDialog) { }

  ngOnInit() {
    this.subscriptionService.getSubscriptionInfo().subscribe((subscriptionInfo) => {
      this.subscriptionInfo = subscriptionInfo;
      this.subscriptionType = this.subscriptionInfo.subscriptionType;
    })
  }

  openReviewPaymentDialog(subscriptionChange): void {
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
          this.updateSubscriptionType(this.selectedSubscriptionType, priceId);
        }
      }
    });
  }

  selectSubscriptionType(selectedSubscriptionType: subscriptionType) {
    this.selectedSubscriptionType = selectedSubscriptionType;
    const subscriptionChange = new SubscriptionChange(selectedSubscriptionType, this.subscriptionType)
    this.openReviewPaymentDialog(subscriptionChange);
  }

  updateSubscriptionType(selectedSubscriptionType, priceId) {
    //This is probably incorrect. Need to review subscription type is none workflow
    // Review with LZ
    if (this.subscriptionInfo.subscriptionType == 'none') {
      this.router.navigate(['./', { outlets: { view: ['billing'] } }]);
    }

    if (this.subscriptionInfo.subscriptionActive && this.subscriptionInfo.subscriptionType != 'none') {
      this.subscriptionService.updateStripeSubscription(priceId).subscribe((r) => {
        this.router.navigate(['./', { outlets: { view: ['payment-success'] } }]);
      })
    } else if (!this.subscriptionInfo.subscriptionActive && this.subscriptionInfo.subscriptionType != 'none') {
      this.router.navigate([{ outlets: { primary: 'dashboard', view: `payment/${selectedSubscriptionType}` } }]);
    }
  }
}
