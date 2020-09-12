import { Component, OnInit } from '@angular/core';
import { SubscriptionsService } from 'src/app/_services/subscriptions.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
  subscriptionActive: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
