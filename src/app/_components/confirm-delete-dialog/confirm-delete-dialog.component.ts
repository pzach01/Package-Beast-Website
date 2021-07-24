import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss']
})
export class ConfirmDeleteDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public confirmDeleteRef: MatDialogRef<ConfirmDeleteDialogComponent>, private router: Router) { }

  ngOnInit(): void {
  }

  delete(): void {
    this.confirmDeleteRef.close({ delete: true })
  }
}
