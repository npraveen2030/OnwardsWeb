import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectmanagementComponent } from './projectmanagement.component';

describe('ProjectmanagementComponent', () => {
  let component: ProjectmanagementComponent;
  let fixture: ComponentFixture<ProjectmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectmanagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
