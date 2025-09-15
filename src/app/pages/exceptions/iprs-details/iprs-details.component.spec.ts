import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IprsDetailsComponent } from './iprs-details.component';

describe('IprsDetailsComponent', () => {
  let component: IprsDetailsComponent;
  let fixture: ComponentFixture<IprsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IprsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IprsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
