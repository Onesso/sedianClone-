import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KraLogsComponent } from './kra-logs.component';

describe('KraLogsComponent', () => {
  let component: KraLogsComponent;
  let fixture: ComponentFixture<KraLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KraLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KraLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
