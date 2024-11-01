import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/_models'
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';
import { Shipment } from 'src/app/_models/shipment';
import { faCube, faBoxOpen, faCog, faTruck, faSignOutAlt, faBars, faAngleDoubleLeft, faCreditCard, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';
import { MatDialog } from '@angular/material/dialog';
import { TermsOfServiceDialogComponent } from 'src/app/_components/terms-of-service-dialog/terms-of-service-dialog.component';
import { PrivacyPolicyDialogComponent } from '../privacy-policy-dialog/privacy-policy-dialog.component';
declare let gtag: Function;

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
  faQuestionCircle = faQuestionCircle;
  firstName = this.currentUser.first_name
  paymentUpToDate: boolean;

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
    private subscriptionService: SubscriptionsService,
    public termsOfServiceDialog: MatDialog,
    public privacyPolicyDialog: MatDialog,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'UA-111683104-2',
          {
            'page_path': event.urlAfterRedirects
          }
        );
        gtag('config', 'AW-445804472'),
        {
          'page_path': event.urlAfterRedirects
        };
      }
    })
  }


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

  goToUserGuide() {
    this.router.navigate([{ outlets: { primary: 'dashboard', view: 'user-guide' } }]);
  }
}
