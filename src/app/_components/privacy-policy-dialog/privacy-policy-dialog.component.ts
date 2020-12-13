import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-privacy-policy-dialog',
  templateUrl: './privacy-policy-dialog.component.html',
  styleUrls: ['./privacy-policy-dialog.component.scss']
})
export class PrivacyPolicyDialogComponent implements OnInit {

  constructor(public createFailRef: MatDialogRef<PrivacyPolicyDialogComponent>) { }

  ngOnInit(): void {
  }

}
