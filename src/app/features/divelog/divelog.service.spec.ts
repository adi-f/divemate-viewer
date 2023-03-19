import { TestBed } from '@angular/core/testing';

import { DivelogService } from './divelog.service';

describe('DivelogService', () => {
  let service: DivelogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DivelogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
