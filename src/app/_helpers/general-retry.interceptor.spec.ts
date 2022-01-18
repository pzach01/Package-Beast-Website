import { TestBed } from '@angular/core/testing';

import { GeneralRetryInterceptor } from './general-retry.interceptor';

describe('GeneralRetryInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      GeneralRetryInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: GeneralRetryInterceptor = TestBed.inject(GeneralRetryInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
