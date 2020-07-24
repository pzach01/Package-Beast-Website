import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import { AuthenticationService } from 'src/app/_services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  subscriptionType: string;
  elements: Elements;
  card: StripeElement;

  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  stripeTest: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.subscriptionType = params['subscriptionType'];
      console.log(this.subscriptionType)
    })
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        // Only mount the element the first time
        if (!this.card) {
          this.card = this.elements.create('card', {
            style: {
              base: {
                iconColor: '#666EE8',
                color: '#31325F',
                fontWeight: 300,
                // fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                  color: '#CFD7E0'
                }
              }
            }
          });
          this.card.mount('#card-element');
        }
      });
  }

  buy() {
    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          console.log(result.token);
          this.authenticationService.updateUser({
            subscriptionType: this.subscriptionType
          }).subscribe(() => this.router.navigate([{ outlets: { primary: 'dashboard', view: 'billing' } }]))
        }
        else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }

}

