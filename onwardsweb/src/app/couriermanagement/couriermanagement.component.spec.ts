import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouriermanagementComponent } from './couriermanagement.component';

describe('CouriermanagementComponent', () => {
  let component: CouriermanagementComponent;
  let fixture: ComponentFixture<CouriermanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouriermanagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouriermanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
