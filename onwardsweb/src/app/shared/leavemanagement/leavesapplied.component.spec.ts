import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesappliedComponent } from './leavesapplied.component';

describe('LeavesappliedComponent', () => {
  let component: LeavesappliedComponent;
  let fixture: ComponentFixture<LeavesappliedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavesappliedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavesappliedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
