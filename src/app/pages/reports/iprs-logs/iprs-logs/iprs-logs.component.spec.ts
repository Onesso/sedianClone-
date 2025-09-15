import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IprsLogsComponent } from './iprs-logs.component';

describe('IprsLogsComponent', () => {
  let component: IprsLogsComponent;
  let fixture: ComponentFixture<IprsLogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IprsLogsComponent]
    });
    fixture = TestBed.createComponent(IprsLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
