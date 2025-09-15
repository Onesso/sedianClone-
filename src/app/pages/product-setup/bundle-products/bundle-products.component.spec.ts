import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleProductsComponent } from './bundle-products.component';

describe('BundleProductsComponent', () => {
  let component: BundleProductsComponent;
  let fixture: ComponentFixture<BundleProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BundleProductsComponent]
    });
    fixture = TestBed.createComponent(BundleProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
