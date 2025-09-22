import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerdashboardComponent } from './careerdashboard.component';

describe('CareerdashboardComponent', () => {
  let component: CareerdashboardComponent;
  let fixture: ComponentFixture<CareerdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerdashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CareerdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
