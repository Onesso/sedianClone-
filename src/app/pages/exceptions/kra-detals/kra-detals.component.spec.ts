import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KraDetalsComponent } from './kra-detals.component';

describe('KraDetalsComponent', () => {
  let component: KraDetalsComponent;
  let fixture: ComponentFixture<KraDetalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KraDetalsComponent]
    });
    fixture = TestBed.createComponent(KraDetalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
