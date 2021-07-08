import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShippoAuthenticationService } from 'src/app/_services/shippo-authentication.service';

@Component({
  selector: 'app-shippo-oauth-redirect',
  templateUrl: './shippo-oauth-redirect.component.html',
  styleUrls: ['./shippo-oauth-redirect.component.scss']
})
export class ShippoOauthRedirectComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private shippoAuthenticationService: ShippoAuthenticationService) { console.log("hello 1") }

  ngOnInit(): void {
    console.log('Hello 2')
    const code: string = this.route.snapshot.queryParamMap.get('code');
    const state: string = this.route.snapshot.queryParamMap.get('state');
    const error: string = this.route.snapshot.queryParamMap.get('error');

    console.log('code', code)
    console.log('state', state)
    console.log('error', error)
    this.shippoAuthenticationService.authenticate(code).subscribe((r) => {
      console.log('r', r);
      this.router.navigate([{ outlets: { primary: 'dashboard', view: 'inventory' } }]);
    }, error => {
      this.router.navigate([{ outlets: { primary: 'dashboard', view: 'inventory' } }]);
      console.log('eeerrrooorrr', error)
    })
  }

}
