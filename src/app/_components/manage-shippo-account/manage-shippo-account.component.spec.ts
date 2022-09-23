import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageShippoAccountComponent } from './manage-shippo-account.component';

describe('ManageShippoAccountComponent', () => {
  let component: ManageShippoAccountComponent;
  let fixture: ComponentFixture<ManageShippoAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageShippoAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageShippoAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
