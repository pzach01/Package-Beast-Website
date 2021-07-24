import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-label-creation-dialog',
  templateUrl: './confirm-label-creation-dialog.component.html',
  styleUrls: ['./confirm-label-creation-dialog.component.scss']
})
export class ConfirmLabelCreationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public confirmLabelCreationRef: MatDialogRef<ConfirmLabelCreationDialogComponent>) { }

  ngOnInit(): void {
  }

  createLabel() {
    this.confirmLabelCreationRef.close({ purchase: true })
  }
}
