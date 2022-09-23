import { Component, OnInit } from '@angular/core';
import { ShippoService } from 'src/app/_services/shippo.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register-shippo-account',
  templateUrl: './register-shippo-account.component.html',
  styleUrls: ['./register-shippo-account.component.scss']
})
export class RegisterShippoAccountComponent implements OnInit {

  constructor(private shippoService: ShippoService) { }

  ngOnInit(): void { }
  shippoLogin() {
    const state = this.shippoService.createShippoRandomString(40)
    const shippoLoginUrl = `https://goshippo.com/oauth/authorize?response_type=code&client_id=${environment.SHIPPO_CLIENT_ID}&scope=*&state=${state}`;
    console.log("navigate to shippo login")
    window.location.href = shippoLoginUrl
  }

}
