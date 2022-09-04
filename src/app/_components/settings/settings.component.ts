import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';
import { Timestamp } from 'src/app/_models/timestamp'
import { environment } from 'src/environments/environment'
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { faUps, faUsps } from '@fortawesome/free-brands-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faRuler, faSpinner } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  envTitle = environment.SITE_TITLE;
  saveStatusText: string = "Settings Saved!"
  currentUser = this.authenticationService.currentUserValue;
  faRuler = faRuler
  faClock = faClock
  faUps = faUps
  faUsps = faUsps
  faSpinner = faSpinner
  units = this.currentUser.units
  weightUnits = this.currentUser.weightUnits
  dateTimeFormat = this.currentUser.dateTimeFormat
  multiBinPack = this.currentUser.multiBinPack
  disableFillContainerAnimation = this.currentUser.disableFillContainerAnimation
  disablePreviousNextItemAnimation = this.currentUser.disablePreviousNextItemAnimation
  animationSpeed = this.currentUser.animationSpeed
  includeUpsContainers = this.currentUser.includeUpsContainers
  includeUspsContainers = this.currentUser.includeUspsContainers
  buildTimestamp = Timestamp.timestamp;
  save$: Subscription


  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    // this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser);
    this.authenticationService.getUser().subscribe((currentUser) => this.currentUser = currentUser);
  }

  goToChangePassword() {
    this.router.navigate(['./', { outlets: { view: ['change-password'] } }]);
  }

  goToChangeUserInformation() {
    this.router.navigate(['./', { outlets: { view: ['edit-user-information'] } }]);
  }

  goToDevelopers() {
    this.router.navigate(['./', { outlets: { view: ['developers'] } }]);
  }

  manageShippoAccount() {
    this.router.navigate(['./', { outlets: { view: ['manage-shippo-account'] } }]);
  }

  save() {
    if (this.save$ != undefined) {
      this.save$.unsubscribe();
    }
    this.saveStatusText = "Saving"
    const source = interval(500)
    const numAttempts = source.pipe(take(1))
    this.save$ = numAttempts.subscribe(() => {
      this.authenticationService.updateUser({
        units: this.units, dateTimeFormat: this.dateTimeFormat,
        weightUnits: this.weightUnits,
        multiBinPack: this.multiBinPack,
        disableFillContainerAnimation: this.disableFillContainerAnimation,
        disablePreviousNextItemAnimation: this.disablePreviousNextItemAnimation,
        animationSpeed: this.animationSpeed,
        includeUpsContainers: this.includeUpsContainers,
        includeUspsContainers: this.includeUspsContainers
      })
        .subscribe(() => { this.saveStatusText = "Settings Saved!" })
    })

  }

}
