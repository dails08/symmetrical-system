import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinScreen } from './join-screen';

describe('JoinScreen', () => {
  let component: JoinScreen;
  let fixture: ComponentFixture<JoinScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinScreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
