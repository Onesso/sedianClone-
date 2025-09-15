import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionTypeComponent } from './rejection-type.component';

describe('RejectionTypeComponent', () => {
  let component: RejectionTypeComponent;
  let fixture: ComponentFixture<RejectionTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RejectionTypeComponent]
    });
    fixture = TestBed.createComponent(RejectionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
