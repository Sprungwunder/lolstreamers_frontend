
export class ListManager {
  itemsList: string[] = []; // Full list of champions, runes or items
  suggestionList: string[] = []; // Filtered list based on search or conditions
  selecteditems: string[] = []; // Selected champions, runes or items
  private readonly maxitems: number; // Max number of allowable selections

  constructor(initialList: string[], maxChampions: number) {
    this.itemsList = initialList;
    this.suggestionList = [...initialList];
    this.maxitems = maxChampions;
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
      (item) => !this.selecteditems.includes(item)
    );
  }

  // Adds a champion to the selected list if the max is not exceeded
  selectItem(item: string): void {
    if (
      !this.selecteditems.includes(item) &&
      this.selecteditems.length < this.maxitems
    ) {
      this.selecteditems.push(item);
    } else {
      console.warn('Max champions reached or champion already selected.');
    }
  }

  // Removes a champion, rune or item from the selected list
  deselectItem(item: string): void {
    this.selecteditems = this.selecteditems.filter(
      (selected) => selected !== item
    );
  }

  clearSuggestions(inputValue: string): void {
    this.suggestionList = this.itemsList.filter(
      item => item.toLowerCase().includes(inputValue.toLowerCase()) &&
        !this.selecteditems.includes(item)
    );
  }

  getAsCommaSeparatedString(): string {
    return this.selecteditems.join(',');
  }

}
