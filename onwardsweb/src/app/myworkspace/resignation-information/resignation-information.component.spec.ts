import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResignationInformationComponent } from './resignation-information.component';

describe('ResignationInformationComponent', () => {
  let component: ResignationInformationComponent;
  let fixture: ComponentFixture<ResignationInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResignationInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResignationInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
