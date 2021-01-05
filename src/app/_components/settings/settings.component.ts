import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';
import { Timestamp } from 'src/app/_models/timestamp'
import { environment } from 'src/environments/environment'


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  envTitle = environment.SITE_TITLE;
  saveStatusText: string = "Settings Saved!"
  currentUser = this.authenticationService.currentUserValue;
  units = this.currentUser.units
  dateTimeFormat = this.currentUser.dateTimeFormat
  multiBinPack = this.currentUser.multiBinPack
  disableFillContainerAnimation = this.currentUser.disableFillContainerAnimation
  disablePreviousNextItemAnimation = this.currentUser.disablePreviousNextItemAnimation
  animationSpeed = this.currentUser.animationSpeed
  buildTimestamp = Timestamp.timestamp;


  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
  }

  goToBilling() {
    this.router.navigate(['./', { outlets: { view: ['billing'] } }]);
  }

  goToChangePassword() {
    this.router.navigate(['./', { outlets: { view: ['change-password'] } }]);
  }

  save() {
    this.saveStatusText = "saving"
    this.authenticationService.updateUser({
      units: this.units, dateTimeFormat: this.dateTimeFormat,
      multiBinPack: this.multiBinPack, disableFillContainerAnimation: this.disableFillContainerAnimation,
      disablePreviousNextItemAnimation: this.disablePreviousNextItemAnimation,
      animationSpeed: this.animationSpeed
    })
      .subscribe(() => this.saveStatusText = "Settings Saved!")
  }

}
