import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {TypeAheadInputComponent} from "../type-ahead-input/type-ahead-input.component";

@Component({
    selector: 'app-champion-name-input',
    imports: [ReactiveFormsModule],
    templateUrl: './champion-name-input.component.html',
    styleUrls: ['./champion-name-input.component.css']
})
export class ChampionNameInputComponent extends TypeAheadInputComponent {
  @Input() placeholder: string = 'Type to filter champion names...';  // Placeholder for input
  @Input() championsList: string[] = [];
  @Input() isAdmin: boolean = false;

  @Output() championsChange = new EventEmitter<string[]>();      // Notify parent about selection changes

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
    if (changes['championsList'] && changes['championsList'].currentValue?.length > 0) {
      this.initializeItemsList();
    }
  }

  override getList(): string[] {
    return this.championsList;
  }

  emitEvent() {
    this.championsChange.emit(this.selectedItems);
  }

}
