
export class ChampionListManager {
  championsList: string[] = []; // Full list of champions
  suggestionList: string[] = []; // Filtered list based on search or conditions
  selectedChampions: string[] = []; // Selected champions
  private readonly maxChampions: number; // Max number of allowable selections

  constructor(initialList: string[], maxChampions: number) {
    this.championsList = initialList;
    this.suggestionList = [...initialList];
    this.maxChampions = maxChampions;
  }

  filterTeamChampions(
    searchTerm: string,
  ): void {
    // Filter champions based on search term
    let filtered = !searchTerm
      ? this.championsList
      : this.championsList.filter((champion) =>
        champion.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Further filter out already selected champions
    this.suggestionList = filtered.filter(
      (champion) => !this.selectedChampions.includes(champion)
    );
  }

  // Adds a champion to the selected list if the max is not exceeded
  selectChampion(champion: string): void {
    if (
      !this.selectedChampions.includes(champion) &&
      this.selectedChampions.length < this.maxChampions
    ) {
      this.selectedChampions.push(champion);
    } else {
      console.warn('Max champions reached or champion already selected.');
    }
  }

  // Removes a champion from the selected list
  deselectChampion(champion: string): void {
    this.selectedChampions = this.selectedChampions.filter(
      (selected) => selected !== champion
    );
  }

  clearSuggestions(inputValue: string): void {
    this.suggestionList = this.championsList.filter(
      champion => champion.toLowerCase().includes(inputValue.toLowerCase()) &&
        !this.selectedChampions.includes(champion)
    );
  }

  getCommaSeparatedChampions(): string {
    return this.selectedChampions.join(',');
  }

}
