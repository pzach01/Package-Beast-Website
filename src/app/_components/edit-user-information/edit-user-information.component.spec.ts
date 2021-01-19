import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserInformationComponent } from './edit-user-information.component';

describe('EditUserInformationComponent', () => {
  let component: EditUserInformationComponent;
  let fixture: ComponentFixture<EditUserInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserInformationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
