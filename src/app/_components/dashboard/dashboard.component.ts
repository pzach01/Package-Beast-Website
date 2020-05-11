import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models'
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  title = "The Packaging Optimizer";
  shipmentsActive = true;
  itemsActive = false;
  containersActive = false;
  settingsActive = false;
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }
  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  decactivateAllComponents() {
    this.shipmentsActive = false;
    this.itemsActive = false;
    this.containersActive = false;
    this.settingsActive = false;
  }
  activateShipments() {
    this.decactivateAllComponents()
    this.shipmentsActive = true;
  }
  activateItems() {
    this.decactivateAllComponents()
    this.itemsActive = true;
  }
  activateContainers() {
    this.decactivateAllComponents()
    this.containersActive = true;
  }
  activateSettings() {
    this.decactivateAllComponents()
    this.settingsActive = true;
  }

}
