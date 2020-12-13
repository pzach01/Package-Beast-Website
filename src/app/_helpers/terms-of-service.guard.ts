import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SubscriptionsService } from '../_services/subscriptions.service';
import { MatDialog } from '@angular/material/dialog';
import { TermsOfServiceDialogComponent } from 'src/app/_components/terms-of-service-dialog/terms-of-service-dialog.component';
import { AuthenticationService } from '../_services';
import { User } from '../_models';


@Injectable({ providedIn: 'root' })
export class TermsOfServiceGuard implements CanActivate {
  constructor(
    private router: Router,
    private subscriptionService: SubscriptionsService,
    public termsOfServiceDialog: MatDialog,
    private authenticationService: AuthenticationService
  ) { }

  currentUser: User = this.authenticationService.currentUserValue;

  openTermsOfServiceDialog() {
    const dialogRef = this.termsOfServiceDialog.open(TermsOfServiceDialogComponent, { data: { forceAgree: true } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    var agreedToLatestTermsOfService = this.currentUser.usersTermsOfServiceRevision == this.currentUser.termsOfServiceRevision

    if (!agreedToLatestTermsOfService) {
      // subscription active so return true
      this.openTermsOfServiceDialog()
    }

    // not subscribed in so redirect to login page with the return url
    //this.router.navigate([{ outlets: { primary: 'dashboard', view: 'billing' } }]);

    // this.router.navigate(['./', { outlets: { view: ['billing'] } }]);
    return true;
  }
}