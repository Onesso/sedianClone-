import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationStatusComponent } from './integration-status.component';

describe('IntegrationStatusComponent', () => {
  let component: IntegrationStatusComponent;
  let fixture: ComponentFixture<IntegrationStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntegrationStatusComponent]
    });
    fixture = TestBed.createComponent(IntegrationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
