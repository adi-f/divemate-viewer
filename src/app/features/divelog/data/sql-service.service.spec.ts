
import { TestBed } from '@angular/core/testing';

import { SqlService } from './sql-service.service';

describe('SqlServiceService', () => {
  let service: SqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
