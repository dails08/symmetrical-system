import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmControlsTactician } from './gm-controls-tactician';

describe('GmControlsTactician', () => {
  let component: GmControlsTactician;
  let fixture: ComponentFixture<GmControlsTactician>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GmControlsTactician]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GmControlsTactician);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
