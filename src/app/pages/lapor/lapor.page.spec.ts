import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporPage } from './lapor.page';

describe('LaporPage', () => {
  let component: LaporPage;
  let fixture: ComponentFixture<LaporPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
