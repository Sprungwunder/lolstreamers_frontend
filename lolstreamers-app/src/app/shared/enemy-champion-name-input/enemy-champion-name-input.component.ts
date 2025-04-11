import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TypeAheadInputComponent} from "../type-ahead-input/type-ahead-input.component";

@Component({
  selector: 'app-enemy-champion-name-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enemy-champion-name-input.component.html',
  styleUrls: ['./enemy-champion-name-input.component.css']
})
export class EnemyChampionNameInputComponent extends TypeAheadInputComponent {
  @Input() placeholder: string = 'Type to search champions...';  // Placeholder for input
  @Input() enemyChampionsList: string[] = [];                    // List of all champions

  @Output() enemyChampionsChange = new EventEmitter<string[]>();      // Notify parent about selection changes

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
    if (changes['enemyChampionsList'] && changes['enemyChampionsList'].currentValue?.length > 0) {
      this.initializeItemsList();
    }
  }

  override getList(): string[] {
    return this.enemyChampionsList;
  }

  emitEvent() {
    this.enemyChampionsChange.emit(this.selectedItems);
  }

}
