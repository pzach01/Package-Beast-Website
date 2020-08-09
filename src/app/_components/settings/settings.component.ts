import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  saveButtonText: string = "Save"
  currentUser = this.authenticationService.currentUserValue;
  units = this.currentUser.units
  dateTimeFormat = this.currentUser.dateTimeFormat
  multiBinPack = this.currentUser.multiBinPack
  disableFillContainerAnimation = this.currentUser.disableFillContainerAnimation
  disablePreviousNextItemAnimation = this.currentUser.disablePreviousNextItemAnimation
  animationSpeed = this.currentUser.animationSpeed


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

  unsaved() {
    this.saveButtonText = "Make sure to save"
  }

  save() {
    this.saveButtonText = "saving"
    this.authenticationService.updateUser({
      units: this.units, dateTimeFormat: this.dateTimeFormat,
      multiBinPack: this.multiBinPack, disableFillContainerAnimation: this.disableFillContainerAnimation,
      disablePreviousNextItemAnimation: this.disablePreviousNextItemAnimation,
      animationSpeed: this.animationSpeed
    })
      .subscribe(() => this.saveButtonText = "saved!")
  }

}
