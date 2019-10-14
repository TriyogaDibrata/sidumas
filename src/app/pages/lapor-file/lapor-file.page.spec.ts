import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporFilePage } from './lapor-file.page';

describe('LaporFilePage', () => {
  let component: LaporFilePage;
  let fixture: ComponentFixture<LaporFilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporFilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporFilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
