import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';
import { ShippoAuthenticationService } from 'src/app/_services/shippo-authentication.service';

@Component({
  selector: 'app-shippo-oauth-redirect',
  templateUrl: './shippo-oauth-redirect.component.html',
  styleUrls: ['./shippo-oauth-redirect.component.scss']
})
export class ShippoOauthRedirectComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private router: Router, private route: ActivatedRoute, private shippoAuthenticationService: ShippoAuthenticationService) { }

  code: string;
  state: string;
  error: string;
  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');
    const error = this.route.snapshot.queryParamMap.get('error');

    console.log('code', code)
    console.log('state', state)
    console.log('error', error)

    console.log("currentRandomStringValue: ", this.shippoAuthenticationService.currentShippoRandomStringValue)

    if (this.shippoAuthenticationService.currentShippoRandomStringValue == state) {
      this.sendCode(code)
    }
  }
  sendCode(code) {
    this.shippoAuthenticationService.authenticate(code).subscribe((r) => {
      console.log('response: ', r);
      this.authenticationService.getUser().subscribe(() => {
        this.router.navigate([{ outlets: { primary: 'dashboard', view: 'inventory' } }]);
      })
    }, error => {
      this.router.navigate([{ outlets: { primary: 'dashboard', view: 'inventory' } }]);
      console.log('eeerrrooorrr', error)
    })
  }

}
