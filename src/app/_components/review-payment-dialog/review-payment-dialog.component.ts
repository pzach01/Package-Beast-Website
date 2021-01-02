import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-payment-dialog',
  templateUrl: './review-payment-dialog.component.html',
  styleUrls: ['./review-payment-dialog.component.scss']
})
export class ReviewPaymentDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public reviewPaymentDialogRef: MatDialogRef<ReviewPaymentDialogComponent>, private router: Router) { }

  changePlanFrom = this.data.changePlanFrom;
  changePlanTo = this.data.changePlanTo;
  selectedPlanPrice = this.data.selectedPlanPrice;
  previousPlanPrice = this.data.previousPlanPrice;
  previousPlanText = this.data.previousPlanText;
  selectedPlanText = this.data.selectedPlanText;
  ngOnInit(): void {

  }

  accept() {
    this.reviewPaymentDialogRef.close({ accept: true })
  }


}
