import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantCalendarComponent } from './participant-calendar.component';

describe('ParticipantCalendarComponent', () => {
  let component: ParticipantCalendarComponent;
  let fixture: ComponentFixture<ParticipantCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
