import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services';
import { ShippoService } from 'src/app/_services/shippo.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-shippo-account',
  templateUrl: './manage-shippo-account.component.html',
  styleUrls: ['./manage-shippo-account.component.scss']
})
export class ManageShippoAccountComponent implements OnInit {

  currentUser: User;
  constructor(private authenticationService: AuthenticationService, private shippoService: ShippoService) { }


  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
  }

  shippoLogin() {
    const state = this.shippoService.createShippoRandomString(40)
    const shippoLoginUrl = `https://goshippo.com/oauth/authorize?response_type=code&client_id=${environment.SHIPPO_CLIENT_ID}&scope=*&state=${state}`;
    console.log("navigate to shippo login")
    window.location.href = shippoLoginUrl
  }

  unlinkShippoAccount() {
    this.authenticationService.updateUser({
      shippoAccessToken: ""
    }).subscribe(() => console.log('Unlinked Shippo account'));
  }

}
