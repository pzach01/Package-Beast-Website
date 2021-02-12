import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-error-dialog',
  templateUrl: './payment-error-dialog.component.html',
  styleUrls: ['./payment-error-dialog.component.scss']
})
export class PaymentErrorDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void { }

}
