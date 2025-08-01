export class ListManager {
  itemsList: string[] = []; // Full list of champions, runes or items
  suggestionList: string[] = []; // Filtered list based on search or conditions
  selectedItems: string[] = []; // Selected champions, runes or items
  private readonly maxItems: number; // Max number of allowable selections

  constructor(initialList: string[], maxChampions: number) {
    this.itemsList = initialList;
    this.suggestionList = [...initialList];
    this.maxItems = maxChampions;
  }

  filterItems(
    searchTerm: string,
  ): void {
    // Filter champions based on search term
    let filtered = !searchTerm
      ? this.itemsList
      : this.itemsList.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Further filter out already selected champions
    this.suggestionList = filtered.filter(
      (item) => !this.selectedItems.includes(item)
    );
  }

  // Adds a champion to the selected list if the max is not exceeded
  selectItem(item: string): void {
    if (
      !!item &&
      !this.selectedItems.includes(item) &&
      this.selectedItems.length < this.maxItems
    ) {
      this.selectedItems.push(item);
    } else {
      console.warn('Max items reached or item already selected or nothing to select.');
    }
  }

  // Removes a champion, rune or item from the selected list
  deselectItem(item: string): void {
    this.selectedItems = this.selectedItems.filter(
      (selected) => selected !== item
    );
  }

  clearSuggestions(inputValue: string): void {
    this.suggestionList = this.itemsList.filter(
      item => item.toLowerCase().includes(inputValue.toLowerCase()) &&
        !this.selectedItems.includes(item)
    );
  }

  // generic functions to handle the list data
  updateList(searchTerm: string | null): string[] {
    if (searchTerm === null) {
      return this.suggestionList;
    }
    this.filterItems(searchTerm);
    return this.suggestionList;
  }

  addItem(item: string, inputValue: string): string[] {
    this.selectItem(item);
    this.clearSuggestions(inputValue);
    return this.suggestionList;
  }

  removeItem(item: string, inputValue: string | undefined): string[] {
    this.deselectItem(item);
    this.filterItems(inputValue || '');
    return this.suggestionList;
  }

}
