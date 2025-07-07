import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmScreen } from './gm-screen';

describe('GmScreen', () => {
  let component: GmScreen;
  let fixture: ComponentFixture<GmScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GmScreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GmScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
