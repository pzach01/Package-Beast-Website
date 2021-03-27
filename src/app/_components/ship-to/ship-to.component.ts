import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-ship-to',
  templateUrl: './ship-to.component.html',
  styleUrls: ['./ship-to.component.scss']
})
export class ShipToComponent implements OnInit {
  addressForm: FormGroup;
  currentUser: User

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.addressForm = this.formBuilder.group({
      first_name: [""],
      last_name: [""],
      addressLine1: [""],
      addressLine2: [""],
      city: [""],
      stateProvince: [""],
      country: [""],
      postalCode: [""]
    });
  }

}
