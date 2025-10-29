import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {TypeAheadInputComponent} from "../type-ahead-input/type-ahead-input.component";

@Component({
    selector: 'app-runes-input',
    imports: [ReactiveFormsModule],
    templateUrl: './runes-input.component.html',
    styleUrls: ['./runes-input.component.css']
})
export class RunesInputComponent extends TypeAheadInputComponent {
  @Input() placeholder: string = 'Type to filter for runes...';  // Placeholder for input
  @Input() runesList: string[] = [];                         // List of all runes

  @Output() runesChange = new EventEmitter<string[]>();      // Notify parent about selection changes

  override  maxItems = 6

  constructor() {
    super();
    // Filter runes as user types
    this.itemInput.valueChanges.subscribe(value =>
      this.itemsSuggestionList = this.itemsListManager.updateList(value)
    );
  }

  /**
   * Called whenever Input properties are updated.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['runesList'] && changes['runesList'].currentValue?.length > 0) {
      this.initializeItemsList();
    }
  }

  override getList(): string[] {
    return this.runesList;
  }

  emitEvent() {
    this.runesChange.emit(this.selectedItems);
  }

}
