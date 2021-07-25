import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/_models'
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';
import { Shipment } from 'src/app/_models/shipment';
import { faCube, faBoxOpen, faCog, faTruck, faSignOutAlt, faBars, faAngleDoubleLeft, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';
import { MatDialog } from '@angular/material/dialog';
import { TermsOfServiceDialogComponent } from 'src/app/_components/terms-of-service-dialog/terms-of-service-dialog.component';
import { PrivacyPolicyDialogComponent } from '../privacy-policy-dialog/privacy-policy-dialog.component';
import { environment } from 'src/environments/environment';
import { ShippoAuthenticationService } from 'src/app/_services/shippo-authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  title = "Package Beast Dashboard";
  currentUser: User = this.authenticationService.currentUserValue;
  shipment: Shipment;
  faCube = faCube;
  faBoxOpen = faBoxOpen;
  faCog = faCog;
  faTruck = faTruck;
  faSignOutAlt = faSignOutAlt
  faBars = faBars;
  leftArrow = faAngleDoubleLeft;
  faCC = faCreditCard;
  firstName = this.currentUser.first_name
  paymentUpToDate: boolean;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private subscriptionService: SubscriptionsService,
    public termsOfServiceDialog: MatDialog,
    public privacyPolicyDialog: MatDialog,
    private shipoAuthenticationService: ShippoAuthenticationService
  ) { }


  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(x => { this.currentUser = x; this.firstName = x.first_name });
    this.subscriptionService.currentSubscriptionInfo.subscribe(currentSubscription => this.paymentUpToDate = currentSubscription.paymentUpToDate);
  }

  openTermsOfServiceDialog() {
    const dialogRef = this.termsOfServiceDialog.open(TermsOfServiceDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: { forceAgree: false }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openPrivacyPolicyDialog() {
    const dialogRef = this.privacyPolicyDialog.open(PrivacyPolicyDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(result => { });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate([{ outlets: { primary: 'login', view: null } }]);
  }
}
