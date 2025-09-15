import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconcileIdComponent } from './reconcile-id.component';

describe('ReconcileIdComponent', () => {
  let component: ReconcileIdComponent;
  let fixture: ComponentFixture<ReconcileIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReconcileIdComponent]
    });
    fixture = TestBed.createComponent(ReconcileIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
