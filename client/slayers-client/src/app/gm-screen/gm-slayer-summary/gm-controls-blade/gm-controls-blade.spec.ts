import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmControlsBlade } from './gm-controls-blade';

describe('GmControlsBlade', () => {
  let component: GmControlsBlade;
  let fixture: ComponentFixture<GmControlsBlade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GmControlsBlade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GmControlsBlade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
