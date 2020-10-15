import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordCompleteDialogComponent } from './change-password-complete-dialog.component';

describe('ChangePasswordCompleteDialogComponent', () => {
  let component: ChangePasswordCompleteDialogComponent;
  let fixture: ComponentFixture<ChangePasswordCompleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordCompleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordCompleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
