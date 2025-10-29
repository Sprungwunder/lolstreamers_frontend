import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {TypeAheadInputComponent} from "../type-ahead-input/type-ahead-input.component";

@Component({
    selector: 'app-enemy-team-champions-input',
    imports: [ReactiveFormsModule],
    templateUrl: './enemy-team-champions-input.component.html',
    styleUrls: ['./enemy-team-champions-input.component.css']
})
export class EnemyTeamChampionsInputComponent extends TypeAheadInputComponent {
  @Input() placeholder: string = 'Type to filter for team-champions...';  // Placeholder for input
  @Input() enemyTeamChampionsList: string[] = [];                         // List of all team-champions

  @Output() enemyTeamChampionsChange = new EventEmitter<string[]>();      // Notify parent about selection changes

  override  maxItems = 4

  constructor() {
    super();
    // Filter team-champions as user types
    this.itemInput.valueChanges.subscribe(value =>
      this.itemsSuggestionList = this.itemsListManager.updateList(value)
    );
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
    return this.enemyTeamChampionsList;
  }

  emitEvent() {
    this.enemyTeamChampionsChange.emit(this.selectedItems);
  }

}
