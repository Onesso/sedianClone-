import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAffiliateComponent } from './new-affiliate.component';

describe('NewAffiliateComponent', () => {
  let component: NewAffiliateComponent;
  let fixture: ComponentFixture<NewAffiliateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewAffiliateComponent]
    });
    fixture = TestBed.createComponent(NewAffiliateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
