import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {TypeAheadInputComponent} from "../type-ahead-input/type-ahead-input.component";

@Component({
    selector: 'app-season-input',
    imports: [ReactiveFormsModule],
    templateUrl: './season-input.component.html',
})
export class SeasonInputComponent extends TypeAheadInputComponent {
  @Input() placeholder: string = 'Type to filter for season...';  // Placeholder for input
  @Input() seasonList: string[] = [];                         // List of all seasons supported
  @Input() isAdmin: boolean = false;

  @Output() seasonChange = new EventEmitter<string[]>();      // Notify parent about selection changes

  override  maxItems = 1

  constructor() {
    super();
    // Filter season as user types
    this.itemInput.valueChanges.subscribe(value =>
      this.itemsSuggestionList = this.itemsListManager.updateList(value)
    );
  }

  /**
   * Called whenever Input properties are updated.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['seasonList'] && changes['seasonList'].currentValue?.length > 0) {
      this.initializeItemsList();
    }
  }

  override getList(): string[] {
    return this.seasonList;
  }

  emitEvent() {
    this.seasonChange.emit(this.selectedItems);
  }

}
