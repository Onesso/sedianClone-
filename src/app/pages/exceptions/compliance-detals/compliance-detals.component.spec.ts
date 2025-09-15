import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceDetalsComponent } from './compliance-detals.component';

describe('ComplianceDetalsComponent', () => {
  let component: ComplianceDetalsComponent;
  let fixture: ComponentFixture<ComplianceDetalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComplianceDetalsComponent]
    });
    fixture = TestBed.createComponent(ComplianceDetalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
