import { TestBed } from '@angular/core/testing';

import { ResignationTypeService } from './resignation-type.service';

describe('ResignationTypeService', () => {
  let service: ResignationTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResignationTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
