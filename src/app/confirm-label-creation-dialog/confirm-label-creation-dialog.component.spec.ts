import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmLabelCreationDialogComponent } from './confirm-label-creation-dialog.component';

describe('ConfirmLabelCreationDialogComponent', () => {
  let component: ConfirmLabelCreationDialogComponent;
  let fixture: ComponentFixture<ConfirmLabelCreationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmLabelCreationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmLabelCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
