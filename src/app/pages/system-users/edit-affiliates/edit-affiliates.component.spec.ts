import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAffiliatesComponent } from './edit-affiliates.component';

describe('EditAffiliatesComponent', () => {
  let component: EditAffiliatesComponent;
  let fixture: ComponentFixture<EditAffiliatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAffiliatesComponent]
    });
    fixture = TestBed.createComponent(EditAffiliatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
