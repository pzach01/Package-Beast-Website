import { TestBed } from '@angular/core/testing';

import { AuthenticatedRedirectGuard } from './authenticated-redirect.guard';

describe('AuthenticatedRedirectGuard', () => {
  let guard: AuthenticatedRedirectGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthenticatedRedirectGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
