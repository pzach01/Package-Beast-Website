import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterShippoAccountComponent } from './register-shippo-account.component';

describe('RegisterShippoAccountComponent', () => {
  let component: RegisterShippoAccountComponent;
  let fixture: ComponentFixture<RegisterShippoAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterShippoAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterShippoAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
