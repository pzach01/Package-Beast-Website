import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { StripeService } from "ngx-stripe";
import { ActivatedRoute, Router } from '@angular/router';
import { CreatePaymentMethodCardData, CreatePaymentMethodData, PaymentIntent, StripeElements, StripeElementsOptions } from '@stripe/stripe-js'
import { SubscriptionsService } from 'src/app/_services/subscriptions.service'
import { SubscriptionChange } from 'src/app/_models/subscription-change';
import { subscriptionType } from 'src/app/_models/subscription-info'
import { MatDialog } from '@angular/material/dialog';
import { PaymentErrorDialogComponent } from '../payment-error-dialog/payment-error-dialog.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  loading: boolean = false;
  subscriptionType: subscriptionType;
  // subscriptionTypeUI: string;
  priceId: string;
  productId: string;
  elements: StripeElements;
  card: any;
  p: PaymentIntent
  stripeError = "";
  country = "US";


  // optional parameters
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  stripeTest: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private subscriptonsService: SubscriptionsService,
    private route: ActivatedRoute,
    public paymentErrorDialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.subscriptionType = params['subscriptionType'];
      const subscriptionChange = new SubscriptionChange(this.subscriptionType, 'none')
      this.priceId = subscriptionChange.priceId
      this.productId = subscriptionChange.productId
    })
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]],
      addressLine1: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      // zip: ['', [Validators.required]],
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
                // fontSize: '16px',
                fontSmoothing: 'antialiased',
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
    this.loading = true;
    const name = this.stripeTest.get('name').value;
    const addressLine1 = this.stripeTest.get('addressLine1').value;
    const city = this.stripeTest.get('city').value;
    const state = this.stripeTest.get('state').value;
    // const zip = this.stripeTest.get('zip').value;

    const payment_intent_data: CreatePaymentMethodCardData = {
      billing_details: {
        name: name,
        address: {
          city: city,
          country: this.country,
          line1: addressLine1,
          line2: "",
          postal_code: "",
          state: state
        }
      },
      type: "card",
      card: this.card
    }

    this.stripeService.createPaymentMethod(payment_intent_data).subscribe(result => {
      if (result.error) {
        this.loading = false
        // this.stripeError = result.error.message
      } else {
        this.subscriptonsService.getSubscriptionInfo().subscribe(subscriptionInfo => {
          subscriptionInfo.subscriptionActive ? this.retrySubscription(result.paymentMethod.id) : this.createSubscription(result.paymentMethod.id, this.priceId)
        })
      }
    });
  }

  openPaymentErrorDialog(error): void {
    const dialogRef = this.paymentErrorDialog.open(PaymentErrorDialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '100%',
      data: { error },
    });
  }

  createSubscription(paymentMethodId, priceId) {
    this.subscriptonsService.createSubscription(paymentMethodId, priceId).subscribe(result => {
      this.router.navigate(['./', { outlets: { view: ['payment-success'] } }])
    }, e => {
      console.log("error from create subscription: ", e)
      this.openPaymentErrorDialog(e)
      this.loading = false
    }
    );
  }

  retrySubscription(paymentMethodId) {
    this.subscriptonsService.retrySubscription(paymentMethodId).subscribe(result => {
      this.router.navigate(['./', { outlets: { view: ['payment-method-change-success'] } }]);
    }, e => {
      console.log("error from retry subscription: ", e)
      this.openPaymentErrorDialog(e)
      this.loading = false
    }

    )
  }

  cancelSubscription() {
    this.subscriptonsService.cancelSubscription().subscribe(result => { })
  }

}

