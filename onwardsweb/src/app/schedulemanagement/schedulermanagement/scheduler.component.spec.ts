import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserschedulemanagementComponent } from './scheduler.component';

describe('UserschedulemanagementComponent', () => {
  let component: UserschedulemanagementComponent;
  let fixture: ComponentFixture<UserschedulemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserschedulemanagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserschedulemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
