import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-terms-of-service-dialog',
  templateUrl: './terms-of-service-dialog.component.html',
  styleUrls: ['./terms-of-service-dialog.component.scss']
})
export class TermsOfServiceDialogComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, public termsOfServiceDialogRef: MatDialogRef<TermsOfServiceDialogComponent>,
  ) { termsOfServiceDialogRef.disableClose = true; }

  ngOnInit(): void {
  }

  agree(): void {
    this.authenticationService.updateUser({
      usersTermsOfServiceRevision: this.authenticationService.currentUserValue.termsOfServiceRevision
    }).subscribe(() => this.termsOfServiceDialogRef.close());
  }

}
