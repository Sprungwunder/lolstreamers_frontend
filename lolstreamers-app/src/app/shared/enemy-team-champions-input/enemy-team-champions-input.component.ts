import {Component, EventEmitter, Input, Output, SimpleChanges, OnInit, OnDestroy} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { Subscription } from 'rxjs';

import {TypeAheadInputComponent} from "../type-ahead-input/type-ahead-input.component";
import {ChampionService} from "../champion-service/champion-service.service";

@Component({
    selector: 'app-enemy-team-champions-input',
    imports: [ReactiveFormsModule],
    templateUrl: './enemy-team-champions-input.component.html',
    styleUrls: ['./enemy-team-champions-input.component.css']
})
export class EnemyTeamChampionsInputComponent extends TypeAheadInputComponent implements OnInit, OnDestroy {
  @Input() placeholder: string = 'Type to filter for team-champions...';  // Placeholder for input
  @Input() enemyTeamChampionsList: string[] = [];                         // List of all team-champions

  @Output() enemyTeamChampionsChange = new EventEmitter<string[]>();      // Notify parent about selection changes

  override  maxItems = 4

  private championSubscription: Subscription = new Subscription();

  constructor(private sharedChampionService: ChampionService) {
    super();
    // Filter team-champions as user types
    this.itemInput.valueChanges.subscribe(value =>
      this.itemsSuggestionList = this.itemsListManager.updateList(value)
    );
  }

  ngOnInit(): void {
    this.championSubscription = this.sharedChampionService.championSelections$.subscribe(() => {
      if (this.itemsListManager) {
        this.reinitializeWithExclusions();
      }
    });
  }

  ngOnDestroy(): void {
    this.championSubscription.unsubscribe();
  }

  /**
   * Called whenever Input properties are updated.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enemyTeamChampionsList'] && changes['enemyTeamChampionsList'].currentValue?.length > 0) {
      this.initializeItemsList();
    }
  }

  override getList(): string[] {
    const excludedChampions = this.sharedChampionService.getExcludedChampions('enemyTeamChampions');
    return this.enemyTeamChampionsList.filter(champion => !excludedChampions.includes(champion));
  }

  emitEvent() {
    this.sharedChampionService.updateSelections('enemyTeamChampions', this.selectedItems);
    this.enemyTeamChampionsChange.emit(this.selectedItems);
  }
}
