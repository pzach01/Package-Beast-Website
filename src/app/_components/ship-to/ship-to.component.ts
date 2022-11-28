import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      city: ['', [Validators.required]],
      stateProvinceCode: ['', [Validators.required]],
      country: ['United States'],
      postalCode: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.addressForm.controls['country'].disable();
  }

}
