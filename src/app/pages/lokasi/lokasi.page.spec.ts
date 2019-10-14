import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LokasiPage } from './lokasi.page';

describe('LokasiPage', () => {
  let component: LokasiPage;
  let fixture: ComponentFixture<LokasiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LokasiPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LokasiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
