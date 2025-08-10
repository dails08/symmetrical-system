import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharSheetGunslinger } from './char-sheet-gunslinger';

describe('CharSheetGunslinger', () => {
  let component: CharSheetGunslinger;
  let fixture: ComponentFixture<CharSheetGunslinger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharSheetGunslinger]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharSheetGunslinger);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
