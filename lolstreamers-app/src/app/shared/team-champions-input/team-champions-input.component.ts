import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TypeAheadInputComponent} from "../type-ahead-input/type-ahead-input.component";

@Component({
    selector: 'app-team-champions-input',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './team-champions-input.component.html',
    styleUrls: ['./team-champions-input.component.css']
})
export class TeamChampionsInputComponent extends TypeAheadInputComponent {
  @Input() placeholder: string = 'Type to filter for team-champions...';  // Placeholder for input
  @Input() teamChampionsList: string[] = [];                         // List of all team-champions

  @Output() teamChampionsChange = new EventEmitter<string[]>();      // Notify parent about selection changes

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
    if (changes['teamChampionsList'] && changes['teamChampionsList'].currentValue?.length > 0) {
      this.initializeItemsList();
    }
  }

  override getList(): string[] {
    return this.teamChampionsList;
  }

  emitEvent() {
    this.teamChampionsChange.emit(this.selectedItems);
  }

}
