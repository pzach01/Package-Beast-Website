import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import { AuthenticationService } from 'src/app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentMethodData } from 'ngx-stripe/lib/interfaces/payment-intent'
import { SubscriptionsService } from 'src/app/_services/subscriptions.service'

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
    private authenticationService: AuthenticationService,
    private subscriptonsService: SubscriptionsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.subscriptionType = params['subscriptionType'];
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

  createPaymentMethod() {
    const name = this.stripeTest.get('name').value;

    const payment_intent_data: PaymentMethodData = {
      billing_details: {
        name: name,
        address: {
          city: "Cedar Rapids",
          country: "US",
          line1: "1349 Hertz Drive SE",
          line2: "",
          postal_code: "52403",
          state: "IA"
        }
      },
      metadata: []
    }

    this.stripeService.createPaymentMethod("card", this.card, payment_intent_data).subscribe(result => {
      if (result.error) {
        console.error('got stripe error', result.error);
      } else {
        console.log('Create payment method succeeded', result);
        this.createSubscription("cus_HtwLDvT3Oskeg8", result.paymentMethod.id, "price_1HBmKWJWFTMXIZUolAQQqNQ9")
      }
    });

  }

  createSubscription(customerId, paymentMethodId, priceId) {
    this.subscriptonsService.createSubscription(customerId, paymentMethodId, priceId).subscribe(result => console.log("subscription result", result))
  }

}

