import { TestBed } from '@angular/core/testing';

import { ShippoAuthenticationService } from './shippo-authentication.service';

describe('ShippoAuthenticationService', () => {
  let service: ShippoAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippoAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
