import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoCardComponent } from './user-info-card.component';

describe('UserInfoCardComponent', () => {
  let component: UserInfoCardComponent;
  let fixture: ComponentFixture<UserInfoCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserInfoCardComponent],
    });
    fixture = TestBed.createComponent(UserInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
