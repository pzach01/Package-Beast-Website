import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewShipmentErrorDialogComponent } from './new-shipment-error-dialog.component';

describe('NewShipmentErrorDialogComponent', () => {
  let component: NewShipmentErrorDialogComponent;
  let fixture: ComponentFixture<NewShipmentErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewShipmentErrorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewShipmentErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
