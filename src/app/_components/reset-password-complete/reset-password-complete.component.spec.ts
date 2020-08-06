import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordCompleteComponent } from './reset-password-complete.component';

describe('ResetPasswordCompleteComponent', () => {
  let component: ResetPasswordCompleteComponent;
  let fixture: ComponentFixture<ResetPasswordCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
