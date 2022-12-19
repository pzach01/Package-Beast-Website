import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './_services';
import { User } from './_models';
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  currentUser: User;
  shippoRedirect: boolean = false;

  constructor(
    private authenticationService: AuthenticationService, private router: Router
  ) {
    // this.formatViewHeight();
    this.authenticationService.currentUser.subscribe(x => { this.currentUser = x; console.log('x', this.currentUser) });
  }
  ngOnInit(): void {
    this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        console.log("route", routerEvent.url)
        console.log("route minus params", routerEvent.url.split('?')[0])
        if (routerEvent.url.split('?')[0] == "/shippo-oauth-redirect") {
          this.shippoRedirect = true;
        } else {
          this.shippoRedirect = false
        }
      }
    })
  }
  formatViewHeight() {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    // We listen to the resize event
    window.addEventListener('resize', () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  }
}
