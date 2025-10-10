import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TypeAheadInputComponent} from "../type-ahead-input/type-ahead-input.component";

@Component({
    selector: 'app-items-input',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './items-input.component.html',
    styleUrls: ['./items-input.component.css']
})
export class ItemsInputComponent extends TypeAheadInputComponent {
  @Input() placeholder: string = 'Type to filter for legendary items...';  // Placeholder for input
  @Input() itemsList: string[] = [];                         // List of all items

  @Output() itemsChange = new EventEmitter<string[]>();      // Notify parent about selection changes

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
    if (changes['itemsList'] && changes['itemsList'].currentValue?.length > 0) {
      this.initializeItemsList();
    }
  }

  override getList(): string[] {
    return this.itemsList;
  }

  emitEvent() {
    this.itemsChange.emit(this.selectedItems);
  }

}
