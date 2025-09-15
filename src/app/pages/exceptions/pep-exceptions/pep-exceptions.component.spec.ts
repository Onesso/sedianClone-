import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PepExceptionsComponent } from './pep-exceptions.component';

describe('PepExceptionsComponent', () => {
  let component: PepExceptionsComponent;
  let fixture: ComponentFixture<PepExceptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PepExceptionsComponent]
    });
    fixture = TestBed.createComponent(PepExceptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
