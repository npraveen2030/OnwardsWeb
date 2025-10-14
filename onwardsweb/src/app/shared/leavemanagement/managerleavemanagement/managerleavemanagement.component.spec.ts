import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerleavemanagementComponent } from './managerleavemanagement.component';

describe('ManagerleavemanagementComponent', () => {
  let component: ManagerleavemanagementComponent;
  let fixture: ComponentFixture<ManagerleavemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerleavemanagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerleavemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
