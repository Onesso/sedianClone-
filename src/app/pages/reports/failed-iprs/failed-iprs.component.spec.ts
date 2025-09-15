import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedIprsComponent } from './failed-iprs.component';

describe('FailedIprsComponent', () => {
  let component: FailedIprsComponent;
  let fixture: ComponentFixture<FailedIprsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FailedIprsComponent]
    });
    fixture = TestBed.createComponent(FailedIprsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
