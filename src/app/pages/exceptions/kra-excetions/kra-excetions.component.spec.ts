import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KraExcetionsComponent } from './kra-excetions.component';

describe('KraExcetionsComponent', () => {
  let component: KraExcetionsComponent;
  let fixture: ComponentFixture<KraExcetionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KraExcetionsComponent]
    });
    fixture = TestBed.createComponent(KraExcetionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
