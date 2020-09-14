import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSubscriptionConfirmationComponent } from './cancel-subscription-confirmation.component';

describe('CancelSubscriptionConfirmationComponent', () => {
  let component: CancelSubscriptionConfirmationComponent;
  let fixture: ComponentFixture<CancelSubscriptionConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelSubscriptionConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelSubscriptionConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
