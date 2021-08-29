import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-refresh-quote-dialog',
  templateUrl: './refresh-quote-dialog.component.html',
  styleUrls: ['./refresh-quote-dialog.component.scss']
})
export class RefreshQuoteDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public refreshQuoteRef: MatDialogRef<RefreshQuoteDialogComponent>) { }

  ngOnInit(): void {
  }

  refreshQuote() {
    this.refreshQuoteRef.close({ refresh: true })
  }

}
