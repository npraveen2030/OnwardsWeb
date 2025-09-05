import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementDetailsComponent } from './reimbursement-details.component';

describe('ReimbursementDetailsComponent', () => {
  let component: ReimbursementDetailsComponent;
  let fixture: ComponentFixture<ReimbursementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReimbursementDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
