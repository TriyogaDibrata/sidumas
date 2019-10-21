import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPlacesPage } from './modal-places.page';

describe('ModalPlacesPage', () => {
  let component: ModalPlacesPage;
  let fixture: ComponentFixture<ModalPlacesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPlacesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPlacesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
