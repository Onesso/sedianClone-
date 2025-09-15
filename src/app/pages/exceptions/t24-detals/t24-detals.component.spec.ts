import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T24DetalsComponent } from './t24-detals.component';

describe('T24DetalsComponent', () => {
  let component: T24DetalsComponent;
  let fixture: ComponentFixture<T24DetalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [T24DetalsComponent]
    });
    fixture = TestBed.createComponent(T24DetalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
