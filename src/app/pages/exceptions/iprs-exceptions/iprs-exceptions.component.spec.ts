import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IprsExceptionsComponent } from './iprs-exceptions.component';

describe('IprsExceptionsComponent', () => {
  let component: IprsExceptionsComponent;
  let fixture: ComponentFixture<IprsExceptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IprsExceptionsComponent]
    });
    fixture = TestBed.createComponent(IprsExceptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
