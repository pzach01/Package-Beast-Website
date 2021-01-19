import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionDowngradeSuccessComponent } from './subscription-downgrade-success.component';

describe('SubscriptionDowngradeSuccessComponent', () => {
  let component: SubscriptionDowngradeSuccessComponent;
  let fixture: ComponentFixture<SubscriptionDowngradeSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionDowngradeSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionDowngradeSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
