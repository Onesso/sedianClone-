import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildAccountsComponent } from './child-accounts.component';

describe('ChildAccountsComponent', () => {
  let component: ChildAccountsComponent;
  let fixture: ComponentFixture<ChildAccountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChildAccountsComponent]
    });
    fixture = TestBed.createComponent(ChildAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
