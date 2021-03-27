import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-ship-from',
  templateUrl: './ship-from.component.html',
  styleUrls: ['./ship-from.component.scss']
})
export class ShipFromComponent implements OnInit {
  addressForm: FormGroup;
  currentUser: User

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.addressForm = this.formBuilder.group({
      first_name: [this.currentUser.first_name],
      last_name: [this.currentUser.last_name],
      addressLine1: [this.currentUser.addressLine1],
      addressLine2: [this.currentUser.addressLine2],
      city: [this.currentUser.city],
      stateProvince: [this.currentUser.stateProvince],
      country: [this.currentUser.country],
      postalCode: [this.currentUser.postalCode]
    });
  }

}
