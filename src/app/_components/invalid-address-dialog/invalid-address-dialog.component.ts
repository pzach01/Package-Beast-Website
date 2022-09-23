import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-invalid-address-dialog',
  templateUrl: './invalid-address-dialog.component.html',
  styleUrls: ['./invalid-address-dialog.component.scss']
})
export class InvalidAddressDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
