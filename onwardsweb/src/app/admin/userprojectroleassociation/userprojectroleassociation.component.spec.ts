import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserprojectroleassociationComponent } from './userprojectroleassociation.component';

describe('UserprojectroleassociationComponent', () => {
  let component: UserprojectroleassociationComponent;
  let fixture: ComponentFixture<UserprojectroleassociationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserprojectroleassociationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserprojectroleassociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
