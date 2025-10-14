import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerleavesComponent } from './managerleaves.component';

describe('ManagerleavesComponent', () => {
  let component: ManagerleavesComponent;
  let fixture: ComponentFixture<ManagerleavesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerleavesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerleavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
