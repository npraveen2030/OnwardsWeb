import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminschedulemanagementComponent } from './adminschedulemanagement.component';

describe('AdminschedulemanagementComponent', () => {
  let component: AdminschedulemanagementComponent;
  let fixture: ComponentFixture<AdminschedulemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminschedulemanagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminschedulemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
