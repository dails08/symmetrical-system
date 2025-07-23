import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmSlayerGunslinger } from './gm-slayer-gunslinger';

describe('GmSlayerGunslinger', () => {
  let component: GmSlayerGunslinger;
  let fixture: ComponentFixture<GmSlayerGunslinger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GmSlayerGunslinger]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GmSlayerGunslinger);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
