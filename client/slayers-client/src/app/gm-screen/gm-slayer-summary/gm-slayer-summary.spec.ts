import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmSlayerSummary } from './gm-slayer-summary';

describe('GmSlayerSummary', () => {
  let component: GmSlayerSummary;
  let fixture: ComponentFixture<GmSlayerSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GmSlayerSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GmSlayerSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
