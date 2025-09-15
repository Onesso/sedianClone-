import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsArchivedComponent } from './documents-archived.component';

describe('DocumentsArchivedComponent', () => {
  let component: DocumentsArchivedComponent;
  let fixture: ComponentFixture<DocumentsArchivedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentsArchivedComponent]
    });
    fixture = TestBed.createComponent(DocumentsArchivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
