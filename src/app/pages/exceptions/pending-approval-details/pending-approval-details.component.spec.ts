import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingApprovalDetailsComponent } from './pending-approval-details.component';

describe('PendingApprovalDetailsComponent', () => {
  let component: PendingApprovalDetailsComponent;
  let fixture: ComponentFixture<PendingApprovalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingApprovalDetailsComponent]
    });
    fixture = TestBed.createComponent(PendingApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
