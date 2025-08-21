import { TestBed } from '@angular/core/testing';

import { ResignationReasonService } from './resignation-reason.service';

describe('ResignationReasonService', () => {
  let service: ResignationReasonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResignationReasonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
