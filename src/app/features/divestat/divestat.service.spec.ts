import { TestBed } from '@angular/core/testing';
import { DivestatService } from './divestat.service';

describe('DivestatService', () => {
  let service: DivestatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DivestatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
