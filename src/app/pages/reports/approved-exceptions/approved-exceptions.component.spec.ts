import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedExceptionsComponent } from './approved-exceptions.component';

describe('ApprovedExceptionsComponent', () => {
  let component: ApprovedExceptionsComponent;
  let fixture: ComponentFixture<ApprovedExceptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovedExceptionsComponent]
    });
    fixture = TestBed.createComponent(ApprovedExceptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
