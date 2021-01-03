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

  subscriptionChange = this.data

  ngOnInit(): void {
    console.log(this.subscriptionChange)
  }

  accept() {
    this.reviewPaymentDialogRef.close({ accept: true })
  }


}
