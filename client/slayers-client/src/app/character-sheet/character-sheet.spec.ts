import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterSheet } from './character-sheet';

describe('CharacterSheet', () => {
  let component: CharacterSheet;
  let fixture: ComponentFixture<CharacterSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterSheet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterSheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
