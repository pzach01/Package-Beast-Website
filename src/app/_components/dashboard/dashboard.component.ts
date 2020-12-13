import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/_models'
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';
import { Shipment } from 'src/app/_models/shipment';
import { faCube, faBoxOpen, faCog, faTruck, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';
import { MatDialog } from '@angular/material/dialog';
import { TermsOfServiceDialogComponent } from 'src/app/_components/terms-of-service-dialog/terms-of-service-dialog.component';
import { PrivacyPolicyDialogComponent } from '../privacy-policy-dialog/privacy-policy-dialog.component';


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
  firstName = this.currentUser.first_name
  paymentUpToDate: boolean;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private subscriptionService: SubscriptionsService,
    public termsOfServiceDialog: MatDialog,
    public privacyPolicyDialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.subscriptionService.currentSubscriptionInfo.subscribe(currentSubscription => this.paymentUpToDate = currentSubscription.paymentUpToDate)
  }

  openMenu() {
    console.log("menu opened")
  }

  openTermsOfServiceDialog() {
    const dialogRef = this.termsOfServiceDialog.open(TermsOfServiceDialogComponent, { data: { forceAgree: false } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openPrivacyPolicyDialog() {
    const dialogRef = this.privacyPolicyDialog.open(PrivacyPolicyDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate([{ outlets: { primary: 'login', view: null } }]);
  }
}
