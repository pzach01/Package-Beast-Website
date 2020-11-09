import { TestBed } from '@angular/core/testing';

import { TermsOfServiceGuard } from './terms-of-service.guard';

describe('TermsOfServiceGuard', () => {
  let guard: TermsOfServiceGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TermsOfServiceGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
