import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerIpAddressComponent } from './customer-ip-address.component';

describe('CustomerIpAddressComponent', () => {
  let component: CustomerIpAddressComponent;
  let fixture: ComponentFixture<CustomerIpAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerIpAddressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerIpAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
