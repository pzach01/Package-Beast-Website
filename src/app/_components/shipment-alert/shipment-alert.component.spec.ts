import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentAlertComponent } from './shipment-alert.component';

describe('ShipmentAlertComponent', () => {
  let component: ShipmentAlertComponent;
  let fixture: ComponentFixture<ShipmentAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
