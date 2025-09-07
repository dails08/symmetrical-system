import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaneMenu } from './bane-menu';

describe('BaneMenu', () => {
  let component: BaneMenu;
  let fixture: ComponentFixture<BaneMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaneMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaneMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
