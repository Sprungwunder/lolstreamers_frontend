import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TypeAheadInputComponent} from "../type-ahead-input/type-ahead-input.component";

@Component({
  selector: 'app-lane-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lane-input.component.html',
  styleUrls: ['./lane-input.component.css']
})
export class LaneInputComponent extends TypeAheadInputComponent {
  @Input() placeholder: string = 'Type to filter for lane...';  // Placeholder for input
  @Input() lanesList: string[] = [];                         // List of all lanes
  @Input() isAdmin: boolean = false;

  @Output() lanesChange = new EventEmitter<string[]>();      // Notify parent about selection changes

  override  maxItems = 1

  constructor() {
    super();
    // Filter lanes as user types
    this.itemInput.valueChanges.subscribe(value =>
      this.itemsSuggestionList = this.itemsListManager.updateList(value)
    );
  }

  /**
   * Called whenever Input properties are updated.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lanesList'] && changes['lanesList'].currentValue?.length > 0) {
      this.initializeItemsList();
    }
  }

  override getList(): string[] {
    return this.lanesList;
  }

  emitEvent() {
    this.lanesChange.emit(this.selectedItems);
  }

}
