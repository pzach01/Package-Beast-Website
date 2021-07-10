import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShippoAuthenticationService } from 'src/app/_services/shippo-authentication.service';

@Component({
  selector: 'app-shippo-oauth-redirect',
  templateUrl: './shippo-oauth-redirect.component.html',
  styleUrls: ['./shippo-oauth-redirect.component.scss']
})
export class ShippoOauthRedirectComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private shippoAuthenticationService: ShippoAuthenticationService) { }

  code: string;
  state: string;
  error: string;
  ngOnInit(): void {
    this.code = this.route.snapshot.queryParamMap.get('code');
    this.state = this.route.snapshot.queryParamMap.get('state');
    this.error = this.route.snapshot.queryParamMap.get('error');

    console.log('code', this.code)
    console.log('state', this.state)
    console.log('error', this.error)
  }
  sendCode() {
    this.shippoAuthenticationService.authenticate(this.code).subscribe((r) => {
      console.log('response: ', r);
      this.router.navigate([{ outlets: { primary: 'dashboard', view: 'inventory' } }]);
    }, error => {
      this.router.navigate([{ outlets: { primary: 'dashboard', view: 'inventory' } }]);
      console.log('eeerrrooorrr', error)
    })
  }

}