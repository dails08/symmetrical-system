import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chamber } from './chamber';

describe('Chamber', () => {
  let component: Chamber;
  let fixture: ComponentFixture<Chamber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chamber]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chamber);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
