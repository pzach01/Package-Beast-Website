import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentErrorDialogComponent } from './payment-error-dialog.component';

describe('PaymentErrorDialogComponent', () => {
  let component: PaymentErrorDialogComponent;
  let fixture: ComponentFixture<PaymentErrorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentErrorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
