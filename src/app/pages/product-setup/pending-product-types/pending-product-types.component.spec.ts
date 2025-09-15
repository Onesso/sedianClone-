import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingProductTypesComponent } from './pending-product-types.component';

describe('PendingProductTypesComponent', () => {
  let component: PendingProductTypesComponent;
  let fixture: ComponentFixture<PendingProductTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingProductTypesComponent]
    });
    fixture = TestBed.createComponent(PendingProductTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
