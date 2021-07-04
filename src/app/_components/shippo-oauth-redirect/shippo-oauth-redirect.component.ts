import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShippoAuthenticationService } from 'src/app/_services/shippo-authentication.service';

@Component({
  selector: 'app-shippo-oauth-redirect',
  templateUrl: './shippo-oauth-redirect.component.html',
  styleUrls: ['./shippo-oauth-redirect.component.scss']
})
export class ShippoOauthRedirectComponent implements OnInit {

  constructor(private route: ActivatedRoute, private shippoAuthenticationService: ShippoAuthenticationService) { }

  ngOnInit(): void {
    const code: string = this.route.snapshot.queryParamMap.get('code');
    const state: string = this.route.snapshot.queryParamMap.get('state');
    const error: string = this.route.snapshot.queryParamMap.get('error');

    console.log('code', code)
    console.log('state', state)
    console.log('error', error)
    this.shippoAuthenticationService.authenticate(code).subscribe((r) => console.log('r', r), error => { console.log('eeerrrooorrr', error) })
  }

}
