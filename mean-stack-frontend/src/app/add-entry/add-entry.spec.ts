import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntry } from './add-entry';

describe('AddEntry', () => {
  let component: AddEntry;
  let fixture: ComponentFixture<AddEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
