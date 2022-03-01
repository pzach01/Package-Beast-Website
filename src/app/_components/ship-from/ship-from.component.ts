import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      name: [this.currentUser.first_name + ' ' + this.currentUser.last_name, [Validators.required]],
      phoneNumber: [this.currentUser.phoneNumber, [Validators.required]],
      addressLine1: [this.currentUser.addressLine1, [Validators.required]],
      addressLine2: [this.currentUser.addressLine2],
      city: [this.currentUser.city, [Validators.required]],
      stateProvinceCode: [this.currentUser.stateProvince, [Validators.required]],
      country: [this.currentUser.country],
      postalCode: [this.currentUser.postalCode, [Validators.required, Validators.minLength(5)]]
    });
  }

}
