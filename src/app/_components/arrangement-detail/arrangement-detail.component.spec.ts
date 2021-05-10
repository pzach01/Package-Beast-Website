import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrangementDetailComponent } from './arrangement-detail.component';

describe('ArrangementDetailComponent', () => {
  let component: ArrangementDetailComponent;
  let fixture: ComponentFixture<ArrangementDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrangementDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrangementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
