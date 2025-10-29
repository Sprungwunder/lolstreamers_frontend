import {FormControl} from '@angular/forms';
import {ListManager} from "../../list-manager";

export abstract class TypeAheadInputComponent {
  itemInput = new FormControl('');
  itemsListManager!: ListManager;
  itemsSuggestionList: string[] = [];
  selectedItems: string[] = [];
  maxItems = 1;

  abstract getList(): string[];

  abstract emitEvent(): void;

  /**
   * Initialize or reinitialize the i.e. champions list manager.
   */
  initializeItemsList(): void {
    this.itemsListManager = new ListManager(this.getList(), this.maxItems);
    this.itemsSuggestionList = [...this.getList()]; // Reset filtered list
  }


  // Add i.e. a champion to the selected list
  selectItem(item: string): void {
    this.itemsSuggestionList = this.itemsListManager.addItem(item, this.itemInput.value || '');
    this.selectedItems = this.itemsListManager.selectedItems;
    this.itemInput.setValue(''); // Clear the input field after selection
    this.emitEvent();
  }

  // Remove i.e. a champion from the selected list
  removeItem(item: string): void {
    this.itemsSuggestionList = this.itemsListManager.removeItem(item, undefined);
    this.selectedItems = this.itemsListManager.selectedItems;
    this.emitEvent();
  }

  reinitializeWithExclusions(): void {
    const currentValue = this.itemInput.value || '';
    this.itemsListManager = new ListManager(this.getList(), this.maxItems);
    // Restore selected items
    this.selectedItems.forEach(item => {
      this.itemsListManager.addItem(item, '');
    });
    this.itemsSuggestionList = this.itemsListManager.updateList(currentValue);
  }
}
