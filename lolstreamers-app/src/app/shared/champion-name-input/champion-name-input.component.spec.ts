import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionNameInput } from './champion-name-input.component';

describe('ChampionNameInputComponent', () => {
  let component: ChampionNameInput;
  let fixture: ComponentFixture<ChampionNameInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampionNameInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChampionNameInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
