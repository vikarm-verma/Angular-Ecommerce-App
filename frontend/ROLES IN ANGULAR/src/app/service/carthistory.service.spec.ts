import { TestBed } from '@angular/core/testing';

import { CarthistoryService } from './carthistory.service';

describe('CarthistoryService', () => {
  let service: CarthistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarthistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
