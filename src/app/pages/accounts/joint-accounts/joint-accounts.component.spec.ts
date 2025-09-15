import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JointAccountsComponent } from './joint-accounts.component';

describe('JointAccountsComponent', () => {
  let component: JointAccountsComponent;
  let fixture: ComponentFixture<JointAccountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JointAccountsComponent]
    });
    fixture = TestBed.createComponent(JointAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
