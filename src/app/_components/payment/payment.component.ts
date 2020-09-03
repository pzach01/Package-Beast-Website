import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentMethodData, PaymentIntent } from 'ngx-stripe/lib/interfaces/payment-intent'
import { SubscriptionsService } from 'src/app/_services/subscriptions.service'


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  subscriptionType: string;
  subscriptionTypeUI: string;
  priceId: string;
  productId: string;
  elements: Elements;
  card: any;
  p: PaymentIntent
  stripeError = "";


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
    private subscriptonsService: SubscriptionsService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.subscriptionType = params['subscriptionType'];
      switch (this.subscriptionType) {
        case "minimal":
          this.productId = "prod_HlIwYxguTZCA3U"
          this.priceId = "price_1HBmKWJWFTMXIZUolAQQqNQ9";
          this.subscriptionTypeUI = "Minimal"
          break;
        case "standard":
          this.productId = "prod_HlIxXn97OzLxuF";
          this.priceId = "price_1HBmLCJWFTMXIZUo6Z4yWXqS";
          this.subscriptionTypeUI = "Standard"
          break;
        case "premium":
          this.productId = "prod_HlIxXn97OzLxuF";
          this.priceId = "price_1HBmLCJWFTMXIZUo6Z4yWXqS";
          this.subscriptionTypeUI = "Premium"
          break;
        case "beastMode":
          this.productId = "prod_HlIxXn97OzLxuF";
          this.priceId = "price_1HBmLCJWFTMXIZUo6Z4yWXqS";
          this.subscriptionTypeUI = "Beast Mode"
          break;
      }
    })
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]],
      addressLine1: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required]],
    });
    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        // Only mount the element the first time
        if (!this.card) {
          this.card = this.elements.create('card', {
            iconStyle: 'solid',
            style: {
              base: {
                iconColor: '#8898AA',
                color: 'black',
                lineHeight: '36px',
                fontWeight: 300,
                // fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '19px',

                '::placeholder': {
                  color: '#8898AA',
                },
              },
              invalid: {
                iconColor: '#e85746',
                color: '#e85746',
              }
            },
          });
          this.card.mount('#card-element');
          this.card.addEventListener('change', ({ error }) => {
            if (error) {
              console.log("error", error.message);
              this.stripeError = error.message
            } else {
              this.stripeError = ""
            }
          })
        }

      });
  }

  ngOnDestroy() {
    this.card.removeEventListener('change');
    this.card.destroy();
  }

  createPaymentMethod() {
    const name = this.stripeTest.get('name').value;
    const addressLine1 = this.stripeTest.get('addressLine1').value;
    const city = this.stripeTest.get('city').value;
    const state = this.stripeTest.get('state').value;
    const zip = this.stripeTest.get('zip').value;

    const payment_intent_data: PaymentMethodData = {
      billing_details: {
        name: name,
        address: {
          city: city,
          country: "US",
          line1: addressLine1,
          line2: "",
          postal_code: zip,
          state: state
        }
      },
      metadata: []
    }

    this.stripeService.createPaymentMethod("card", this.card, payment_intent_data).subscribe(result => {
      if (result.error) {
        console.error('got stripe error', result.error);
        // this.stripeError = result.error.message
      } else {
        console.log('Create payment method succeeded', result);
        this.subscriptonsService.checkUserHasStripeSubscription().subscribe(res => {
          res.subscriptionActive ? this.retrySubscription(result.paymentMethod.id) : this.createSubscription(result.paymentMethod.id, this.priceId)
        })

      }
    });
  }

  createSubscription(paymentMethodId, priceId) {
    this.subscriptonsService.createSubscription(paymentMethodId, priceId).subscribe(result => console.log("subscription result", result))
  }

  retrySubscription(paymentMethodId) {
    this.subscriptonsService.retrySubscription(paymentMethodId).subscribe(result => {
      console.log("subscription result", result);
      this.router.navigate(['./', { outlets: { view: ['payment-success'] } }]);

    })
  }

  cancelSubscription() {
    this.subscriptonsService.cancelSubscription().subscribe(result => console.log("sub canceled", result))
  }

}

