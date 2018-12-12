import { TestBed } from '@angular/core/testing';

import { ReturnDataService } from './return-data.service';

describe('ReturnDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReturnDataService = TestBed.get(ReturnDataService);
    expect(service).toBeTruthy();
  });
});
