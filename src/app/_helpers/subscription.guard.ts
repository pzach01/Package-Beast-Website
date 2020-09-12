import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SubscriptionsService } from '../_services/subscriptions.service';

@Injectable({ providedIn: 'root' })
export class SubscriptionGuard implements CanActivate {
  constructor(
    private router: Router,
    private subscriptionService: SubscriptionsService
    // private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentSubscriptionInfo = this.subscriptionService.currentSubscriptionInfoValue;
    if (currentSubscriptionInfo.subscriptionActive) {
      // subscription active so return true
      return true;
    }

    // not subscribed in so redirect to login page with the return url
    this.router.navigate([{ outlets: { primary: 'dashboard', view: 'billing' } }]);

    // this.router.navigate(['./', { outlets: { view: ['billing'] } }]);
    return false;
  }
}