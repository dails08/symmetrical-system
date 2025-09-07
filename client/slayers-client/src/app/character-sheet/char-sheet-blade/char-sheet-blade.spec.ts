import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharSheetBlade } from './char-sheet-blade';

describe('CharSheetBlade', () => {
  let component: CharSheetBlade;
  let fixture: ComponentFixture<CharSheetBlade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharSheetBlade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharSheetBlade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
