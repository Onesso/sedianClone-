import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedKraComponent } from './failed-kra.component';

describe('FailedKraComponent', () => {
  let component: FailedKraComponent;
  let fixture: ComponentFixture<FailedKraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FailedKraComponent]
    });
    fixture = TestBed.createComponent(FailedKraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
