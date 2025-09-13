import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedApplicationComponent } from './saved-application.component';

describe('SavedApplicationComponent', () => {
  let component: SavedApplicationComponent;
  let fixture: ComponentFixture<SavedApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
