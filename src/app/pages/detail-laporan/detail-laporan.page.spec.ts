import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailLaporanPage } from './detail-laporan.page';

describe('DetailLaporanPage', () => {
  let component: DetailLaporanPage;
  let fixture: ComponentFixture<DetailLaporanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailLaporanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailLaporanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
