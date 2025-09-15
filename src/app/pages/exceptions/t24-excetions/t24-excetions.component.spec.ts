import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T24ExcetionsComponent } from './t24-excetions.component';

describe('T24ExcetionsComponent', () => {
  let component: T24ExcetionsComponent;
  let fixture: ComponentFixture<T24ExcetionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [T24ExcetionsComponent]
    });
    fixture = TestBed.createComponent(T24ExcetionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
