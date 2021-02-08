import { Component } from "@angular/core";

import { Timestamp } from 'src/app/_models/timestamp'

import { AuthenticationService } from './_services';
import { User } from './_models';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  currentUser: User;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    // this.formatViewHeight()
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
}
