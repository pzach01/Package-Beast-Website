import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippoOauthRedirectComponent } from './shippo-oauth-redirect.component';

describe('ShippoOauthRedirectComponent', () => {
  let component: ShippoOauthRedirectComponent;
  let fixture: ComponentFixture<ShippoOauthRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippoOauthRedirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippoOauthRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
