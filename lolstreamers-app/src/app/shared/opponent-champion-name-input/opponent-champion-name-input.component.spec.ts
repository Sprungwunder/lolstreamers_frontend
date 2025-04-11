import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpponentChampionNameInputComponent } from './opponent-champion-name-input.component';

describe('OpponentChampionNameInputComponent', () => {
  let component: OpponentChampionNameInputComponent;
  let fixture: ComponentFixture<OpponentChampionNameInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpponentChampionNameInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpponentChampionNameInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
