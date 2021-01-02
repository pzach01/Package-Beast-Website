import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';
import { SubscriptionInfo } from 'src/app/_models';
import { MatDialog } from '@angular/material/dialog';
import { ReviewPaymentDialogComponent } from 'src/app/_components/review-payment-dialog/review-payment-dialog.component';

@Component({
  selector: 'app-select-subscription',
  templateUrl: './select-subscription.component.html',
  styleUrls: ['./select-subscription.component.scss']
})
export class SelectSubscriptionComponent implements OnInit {
  loading: boolean = false;
  subscriptionInfo: SubscriptionInfo = this.subscriptionService.currentSubscriptionInfoValue;
  subscriptionType: string = this.subscriptionInfo.subscriptionType;
  selectedSubscriptionType: string;
  selectedPlanText: string;
  previousPlanText: string;
  selectedPlanPrice: number;
  previousPlanPrice: number;
  priceId: string;

  constructor(private router: Router, private subscriptionService: SubscriptionsService, public reviewPaymentDialog: MatDialog) { }

  ngOnInit() {
    this.subscriptionService.getSubscriptionInfo().subscribe((subscriptionInfo) => {
      this.subscriptionInfo = subscriptionInfo;
      this.subscriptionType = this.subscriptionInfo.subscriptionType;
    })
  }

  openReviewPaymentDialog(changePlanFrom: string, changePlanTo: string, selectedPlanPrice: number, selectedPlanText: string, previousPlanPrice: number, previousPlanText: string): void {
    const dialogRef = this.reviewPaymentDialog.open(ReviewPaymentDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: { changePlanFrom, changePlanTo, selectedPlanPrice, selectedPlanText, previousPlanPrice, previousPlanText },
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data.accept) {
        this.loading = true;
        this.updateSubscriptionType(this.selectedSubscriptionType);
      }
    });
  }

  selectSubscriptionType(selectedSubscriptionType: string) {
    this.selectedSubscriptionType = selectedSubscriptionType;
    switch (selectedSubscriptionType) {
      case "standard":
        this.selectedSubscriptionType = "standard"
        this.selectedPlanText = "Standard";
        this.selectedPlanPrice = 10;
        this.priceId = "price_1HPJLlJWFTMXIZUoMH26j2EB";
        break;
      case "premium":
        this.selectedSubscriptionType = "premium"
        this.selectedPlanText = "Premium";
        this.selectedPlanPrice = 30;
        this.priceId = "price_1HPJNoJWFTMXIZUo60gNaXlm";
        break;
      case "beastMode":
        this.selectedSubscriptionType = "beastMode"
        this.selectedPlanText = "Beast Mode";
        this.selectedPlanPrice = 50;
        this.priceId = "price_1HPJOLJWFTMXIZUoGcXhTnax";
        break;
    }
    this.assignPreviousSubscriptionProperties(this.subscriptionType)
    this.openReviewPaymentDialog(this.subscriptionType, selectedSubscriptionType, this.selectedPlanPrice, this.selectedPlanText, this.previousPlanPrice, this.previousPlanText);
  }

  assignPreviousSubscriptionProperties(previousSubscriptionType: string) {
    switch (previousSubscriptionType) {
      case "standard":
        this.previousPlanPrice = 10;
        this.previousPlanText = "Standard";
        break;
      case "premium":
        this.previousPlanPrice = 30;
        this.previousPlanText = "Premium";
        break;
      case "beastMode":
        this.previousPlanPrice = 50;
        this.previousPlanText = "Beast Mode";
        break;
    }
  }
  updateSubscriptionType(selectedSubscriptionType) {
    if (this.subscriptionInfo.subscriptionType == 'none') {
      this.router.navigate(['./', { outlets: { view: ['billing'] } }]);
    }

    if (this.subscriptionInfo.subscriptionActive && this.subscriptionInfo.subscriptionType != 'none') {
      this.subscriptionService.updateStripeSubscription(this.priceId).subscribe((r) => {
        console.log("response from update Stripe Subscription", r)
        this.router.navigate(['./', { outlets: { view: ['payment-success'] } }]);
      })
    } else if (!this.subscriptionInfo.subscriptionActive && this.subscriptionInfo.subscriptionType != 'none') {
      this.router.navigate([{ outlets: { primary: 'dashboard', view: `payment/${selectedSubscriptionType}` } }]);
    }
  }
}
