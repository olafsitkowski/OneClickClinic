import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuthCreatorComponent } from './user-auth-creator.component';

describe('UserAuthCreatorComponent', () => {
  let component: UserAuthCreatorComponent;
  let fixture: ComponentFixture<UserAuthCreatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserAuthCreatorComponent]
    });
    fixture = TestBed.createComponent(UserAuthCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
