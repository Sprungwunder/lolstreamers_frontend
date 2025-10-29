import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {TypeAheadInputComponent} from "../type-ahead-input/type-ahead-input.component";

@Component({
    selector: 'app-streamer-input',
    imports: [ReactiveFormsModule],
    templateUrl: './streamer-input.component.html',
    styleUrls: ['./streamer-input.component.css']
})
export class StreamerInputComponent extends TypeAheadInputComponent {
  @Input() placeholder: string = 'Type to filter streamer names...';  // Placeholder for input
  @Input() streamerList: string[] = [];
  @Input() isAdmin: boolean = false;

  @Output() streamerChange = new EventEmitter<string[]>();      // Notify parent about selection changes

  override  maxItems = 6

  constructor() {
    super();
    // Filter streamer as user types
    this.itemInput.valueChanges.subscribe(value =>
      this.itemsSuggestionList = this.itemsListManager.updateList(value)
    );
  }

  /**
   * Called whenever Input properties are updated.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['streamerList'] && changes['streamerList'].currentValue?.length > 0) {
      this.initializeItemsList();
    }
  }

  override getList(): string[] {
    return this.streamerList;
  }

  emitEvent() {
    this.streamerChange.emit(this.selectedItems);
  }

}
