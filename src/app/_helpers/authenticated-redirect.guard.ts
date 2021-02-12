import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedRedirectGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentToken = this.authenticationService.currentTokenValue;
    const currentUser = this.authenticationService.currentUserValue

    if (!currentToken || !currentUser) {
      // NOT authorised so return true
      return true;
    }

    // logged in so redirect to dashboard
    this.router.navigate([{ outlets: { primary: 'dashboard', view: 'inventory' } }]);
    return false;
  }

}
