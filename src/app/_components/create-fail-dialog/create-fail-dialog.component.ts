import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-fail-dialog',
  templateUrl: './create-fail-dialog.component.html',
  styleUrls: ['./create-fail-dialog.component.scss']
})
export class CreateFailDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public createFailRef: MatDialogRef<CreateFailDialogComponent>, private router: Router) { }

  ngOnInit(): void {
  }

  goToSelectSubscription() {
    this.createFailRef.close();
    this.router.navigate(['./', { outlets: { view: ['select-subscription'] } }]);
  }

}
