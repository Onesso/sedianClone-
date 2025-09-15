import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PepDetalsComponent } from './pep-detals.component';

describe('PepDetalsComponent', () => {
  let component: PepDetalsComponent;
  let fixture: ComponentFixture<PepDetalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PepDetalsComponent]
    });
    fixture = TestBed.createComponent(PepDetalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
