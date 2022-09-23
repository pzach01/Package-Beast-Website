import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-shipment-error-dialog',
  templateUrl: './new-shipment-error-dialog.component.html',
  styleUrls: ['./new-shipment-error-dialog.component.scss']
})
export class NewShipmentErrorDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
