import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceExceptionsComponent } from './compliance-exceptions.component';

describe('ComplianceExceptionsComponent', () => {
  let component: ComplianceExceptionsComponent;
  let fixture: ComponentFixture<ComplianceExceptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComplianceExceptionsComponent]
    });
    fixture = TestBed.createComponent(ComplianceExceptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
