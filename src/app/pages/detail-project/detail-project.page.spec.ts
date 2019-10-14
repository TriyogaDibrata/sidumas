import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProjectPage } from './detail-project.page';

describe('DetailProjectPage', () => {
  let component: DetailProjectPage;
  let fixture: ComponentFixture<DetailProjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailProjectPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
