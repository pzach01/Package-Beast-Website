import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFailDialogComponent } from './create-fail-dialog.component';

describe('CreateFailDialogComponent', () => {
  let component: CreateFailDialogComponent;
  let fixture: ComponentFixture<CreateFailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
