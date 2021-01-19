import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodChangeSuccessComponent } from './payment-method-change-success.component';

describe('PaymentMethodChangeSuccessComponent', () => {
  let component: PaymentMethodChangeSuccessComponent;
  let fixture: ComponentFixture<PaymentMethodChangeSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentMethodChangeSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMethodChangeSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
