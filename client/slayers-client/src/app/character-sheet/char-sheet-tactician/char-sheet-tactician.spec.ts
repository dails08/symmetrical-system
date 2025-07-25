import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharSheetTactician } from './char-sheet-tactician';

describe('CharSheetTactician', () => {
  let component: CharSheetTactician;
  let fixture: ComponentFixture<CharSheetTactician>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharSheetTactician]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharSheetTactician);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
