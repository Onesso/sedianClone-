import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeRangeComponent } from './income-range.component';

describe('IncomeRangeComponent', () => {
  let component: IncomeRangeComponent;
  let fixture: ComponentFixture<IncomeRangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeRangeComponent]
    });
    fixture = TestBed.createComponent(IncomeRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
