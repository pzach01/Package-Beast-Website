import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainersSelectionComponent } from './containers-selection.component';

describe('ContainersSelectionComponent', () => {
  let component: ContainersSelectionComponent;
  let fixture: ComponentFixture<ContainersSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainersSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainersSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
