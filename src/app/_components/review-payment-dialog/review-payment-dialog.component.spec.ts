import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPaymentDialogComponent } from './review-payment-dialog.component';

describe('ReviewPaymentDialogComponent', () => {
  let component: ReviewPaymentDialogComponent;
  let fixture: ComponentFixture<ReviewPaymentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewPaymentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
