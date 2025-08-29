import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyApprovalComponent } from './my-approval.component';

describe('MyApprovalComponent', () => {
  let component: MyApprovalComponent;
  let fixture: ComponentFixture<MyApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
