import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPengaduanPage } from './edit-pengaduan.page';

describe('EditPengaduanPage', () => {
  let component: EditPengaduanPage;
  let fixture: ComponentFixture<EditPengaduanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPengaduanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPengaduanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
