import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLeavesComponent } from './report-leaves.component';

describe('ReportLeavesComponent', () => {
  let component: ReportLeavesComponent;
  let fixture: ComponentFixture<ReportLeavesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportLeavesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
