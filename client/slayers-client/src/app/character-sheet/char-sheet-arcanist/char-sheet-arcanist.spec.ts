import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharSheetArcanist } from './char-sheet-arcanist';

describe('CharSheetArcanist', () => {
  let component: CharSheetArcanist;
  let fixture: ComponentFixture<CharSheetArcanist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharSheetArcanist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharSheetArcanist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
