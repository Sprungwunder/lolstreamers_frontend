import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TypeAheadInputComponent} from "../type-ahead-input/type-ahead-input.component";

@Component({
  selector: 'app-opponent-champion-name-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './opponent-champion-name-input.component.html',
  styleUrls: ['./opponent-champion-name-input.component.css']
})
export class OpponentChampionNameInput extends TypeAheadInputComponent {
  @Input() placeholder: string = 'Type to search champions...';  // Placeholder for input
  @Input() opponentChampionsList: string[] = [];                         // List of all champions

  @Output() opponentChampionsChange = new EventEmitter<string[]>();      // Notify parent about selection changes

  constructor() {
    super();
    // Filter champions as user types
    this.itemInput.valueChanges.subscribe(value =>
      this.itemsSuggestionList = this.itemsListManager.updateList(value)
    );
  }

  /**
   * Called whenever Input properties are updated.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['opponentChampionsList'] && changes['opponentChampionsList'].currentValue?.length > 0) {
      this.initializeItemsList();
    }
  }

  override getList(): string[] {
    return this.opponentChampionsList;
  }

  emitEvent() {
    this.opponentChampionsChange.emit(this.selectedItems);
  }

}
