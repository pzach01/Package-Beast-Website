import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidAddressDialogComponent } from './invalid-address-dialog.component';

describe('InvalidAddressDialogComponent', () => {
  let component: InvalidAddressDialogComponent;
  let fixture: ComponentFixture<InvalidAddressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvalidAddressDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidAddressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
