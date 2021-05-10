import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipFromComponent } from './ship-from.component';

describe('ShipFromComponent', () => {
  let component: ShipFromComponent;
  let fixture: ComponentFixture<ShipFromComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipFromComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
