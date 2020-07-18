import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/_models'
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';
import { Shipment } from 'src/app/_models/shipment';
import { faCube, faBoxOpen, faCog, faTruck, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

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
  firstName = this.currentUser.first_name

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }


  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate([{ outlets: { primary: 'login', view: null } }]);
  }
}
