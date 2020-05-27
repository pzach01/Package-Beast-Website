import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewShipmentComponent } from './review-shipment.component';

describe('ReviewShipmentComponent', () => {
  let component: ReviewShipmentComponent;
  let fixture: ComponentFixture<ReviewShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
