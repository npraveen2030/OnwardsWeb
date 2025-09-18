import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobdescriptionComponent } from './jobdescription.component';

describe('JobdescriptionComponent', () => {
  let component: JobdescriptionComponent;
  let fixture: ComponentFixture<JobdescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobdescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobdescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
