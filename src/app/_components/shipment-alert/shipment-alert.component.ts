import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-shipment-alert',
  templateUrl: './shipment-alert.component.html',
  styleUrls: ['./shipment-alert.component.scss']
})
export class ShipmentAlertComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
