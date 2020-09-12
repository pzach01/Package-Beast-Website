import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/_models'
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';
import { Shipment } from 'src/app/_models/shipment';
import { faCube, faBoxOpen, faCog, faTruck, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';

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
  subscriptionActive: boolean;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private subscriptionService: SubscriptionsService
  ) { }


  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.subscriptionService.currentSubscriptionInfo.subscribe(currentSubscription => this.subscriptionActive = currentSubscription.subscriptionActive)
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate([{ outlets: { primary: 'login', view: null } }]);
  }
}
