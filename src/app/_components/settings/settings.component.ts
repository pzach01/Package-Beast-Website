import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  currentUser = this.authenticationService.currentUserValue;
  units = this.currentUser.units
  dateTimeFormat = this.currentUser.dateTimeFormat

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
  }

  goToBilling() {
    this.router.navigate(['./', { outlets: { view: ['billing'] } }]);
  }

  save() {
    this.authenticationService.updateUser({ units: this.units, dateTimeFormat: this.dateTimeFormat }).subscribe(() => console.log("saved"))
  }

}
