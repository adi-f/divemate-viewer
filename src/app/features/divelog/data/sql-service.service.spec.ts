import { TestBed } from '@angular/core/testing';

import { SqlServiceService } from './sql-service.service';

describe('SqlServiceService', () => {
  let service: SqlServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqlServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
