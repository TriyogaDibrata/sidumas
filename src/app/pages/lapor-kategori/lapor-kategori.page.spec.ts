import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporKategoriPage } from './lapor-kategori.page';

describe('LaporKategoriPage', () => {
  let component: LaporKategoriPage;
  let fixture: ComponentFixture<LaporKategoriPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporKategoriPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporKategoriPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
