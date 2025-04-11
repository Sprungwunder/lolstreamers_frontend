import {FormControl} from '@angular/forms';
import {ListManager} from "../../list-manager";

export abstract class TypeAheadInputComponent {
  itemInput = new FormControl('');
  itemsListManager!: ListManager;
  itemsSuggestionList: string[] = [];
  selectedItems: string[] = [];

  abstract getList(): string[];

  abstract emitEvent(): void;

  /**
   * Initialize or reinitialize the i.e. champions list manager.
   */
  initializeItemsList(): void {
    this.itemsListManager = new ListManager(this.getList(), 1);
    this.itemsSuggestionList = [...this.getList()]; // Reset filtered list
  }


  // Add i.e. a champion to the selected list
  selectItem(item: string): void {
    this.itemsSuggestionList = this.itemsListManager.addItem(item, this.itemInput.value || '');
    this.selectedItems = this.itemsListManager.selectedItems;
    this.emitEvent();
    this.itemInput.reset();
  }

  // Remove i.e. a champion from the selected list
  removeItem(item: string): void {
    this.itemsSuggestionList = this.itemsListManager.removeItem(item, undefined);
    this.selectedItems = this.itemsListManager.selectedItems;
    this.emitEvent();
  }
}
