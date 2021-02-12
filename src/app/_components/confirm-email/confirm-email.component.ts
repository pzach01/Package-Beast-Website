import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {
  key: string;
  accountStatus: string = "unconfirmed"

  constructor(private route: ActivatedRoute, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.key = params['key'];
      this.confirmAccount(this.key)
    })
  }

  confirmAccount(key): void {
    this.authenticationService.confirmEmail(key)
      .subscribe(
        () => { this.accountStatus = "active" },
        error => {
          this.accountStatus = "error"
        })
  }

}
