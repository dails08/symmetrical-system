import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmControlsArcanist } from './gm-controls-arcanist';

describe('GmControlsArcanist', () => {
  let component: GmControlsArcanist;
  let fixture: ComponentFixture<GmControlsArcanist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GmControlsArcanist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GmControlsArcanist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
