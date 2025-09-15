import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedExceptionsComponent } from './rejected-exceptions.component';

describe('RejectedExceptionsComponent', () => {
  let component: RejectedExceptionsComponent;
  let fixture: ComponentFixture<RejectedExceptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RejectedExceptionsComponent]
    });
    fixture = TestBed.createComponent(RejectedExceptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
