import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TypeAheadInputComponent} from "../type-ahead-input/type-ahead-input.component";

@Component({
  selector: 'app-opponent-team-champions-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './opponent-team-champions-input.component.html',
  styleUrls: ['./opponent-team-champions-input.component.css']
})
export class OpponentTeamChampionsInputComponent extends TypeAheadInputComponent {
  @Input() placeholder: string = 'Type to search for team-champions...';  // Placeholder for input
  @Input() opponentTeamChampionsList: string[] = [];                      // List of all team-champions

  @Output() opponentTeamChampionsChange = new EventEmitter<string[]>();      // Notify parent about selection changes

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
    if (changes['opponentTeamChampionsList'] && changes['opponentTeamChampionsList'].currentValue?.length > 0) {
      this.initializeItemsList();
    }
  }

  override getList(): string[] {
    return this.opponentTeamChampionsList;
  }

  emitEvent() {
    this.opponentTeamChampionsChange.emit(this.selectedItems);
  }

}
