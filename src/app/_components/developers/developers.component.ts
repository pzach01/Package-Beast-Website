import { Component, OnInit } from '@angular/core';
import { Token } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services';

import { faCopy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-developers',
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.scss']
})
export class DevelopersComponent implements OnInit {
  faCopy = faCopy;
  token: Token = this.authenticationService.currentTokenValue;
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.token = this.authenticationService.currentTokenValue
  }

}
