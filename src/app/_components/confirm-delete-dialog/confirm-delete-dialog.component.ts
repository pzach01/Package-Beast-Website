import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateFailDialogComponent } from 'src/app/_components/create-fail-dialog/create-fail-dialog.component';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss']
})
export class ConfirmDeleteDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public confirmDeleteRef: MatDialogRef<CreateFailDialogComponent>, private router: Router) { }

  ngOnInit(): void {
  }

  delete(): void {
    this.confirmDeleteRef.close({ delete: true })
  }
}
