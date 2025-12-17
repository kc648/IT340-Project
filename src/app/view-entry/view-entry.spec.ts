import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEntry } from './view-entry';

describe('ViewEntry', () => {
  let component: ViewEntry;
  let fixture: ComponentFixture<ViewEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
