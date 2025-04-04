import {FormControl, FormGroup} from '@angular/forms';
import {Video} from "../../video";
import {ListManager} from "../../list-manager";
import {VideoService} from "../../video.service";


export abstract class VideoBaseComponent {
  videoList: Video[] = [];
  filteredVideoList: Video[] = [];

  // champions
  championsListManager!: ListManager;
  championsList: string[] = []; // Holds the fetched list of champions
  championsSuggestionList: string[] = []; // Holds the filtered list (for search suggestion)
  selectedChampion: string[] = []; // Holds the selected champion

  // opponent champions
  opponentChampionsListManager!: ListManager;
  opponentChampionsList: string[] = [];
  opponentChampionsSuggestionList: string[] = [];
  selectedOpponentChampion: string[] = [];

  lanesList: string[] = [];
  filteredLanesList: string[] = []; // Initially show all lanes

  teamChampionsListManager!: ListManager;
  opponentTeamChampionsListManager!: ListManager;
  private readonly maxTeamChampions = 4;

  // Runes Management
  runesListManager!: ListManager;
  runesList: string[] = [];
  runesSuggestionList: string[] = [];
  selectedRunes: string[] = [];
  private readonly maxRunes = 5;

  // Items
  itemsListManager!: ListManager;
  itemsList: string[] = [];
  itemsSuggestionList: string[] = [];
  selectedItems: string[] = [];
  private readonly maxItems = 6;

  // team champions
  teamChampionsList: string[] = [];
  teamChampionsSuggestionList: string[] = [];
  selectedTeamChampions: string[] = [];

  // opponent team champions
  opponentTeamChampionsList: string[] = [];
  opponentTeamChampionsSuggestionList: string[] = [];
  selectedOpponentTeamChampions: string[] = [];

  // Search form controls
  searchForm = new FormGroup({
    championName: new FormControl(''),
    lane: new FormControl(''),
    opponentChampionName: new FormControl(''),
    runes: new FormControl(''),
    championItems: new FormControl(''),
    teamChampions: new FormControl(''),
    opponentTeamChampions: new FormControl(''),
  });

  constructor(protected videoService: VideoService) {}

  async initializeData() {
    try {
      const [
        championsList,
        opponentChampionsList,
        runesList,
        championItemsList,
        teamChampionsList,
        opponentTeamChampionsList,
        videoList,
      ] = await this.videoService.fetchInitialData();
      console.log('Fetched initial data:', {championsList, opponentChampionsList, runesList, championItemsList, teamChampionsList, opponentTeamChampionsList, videoList});
      this.championsList = championsList;
      this.championsListManager = new ListManager(championsList, 1);
      this.championsSuggestionList = [...championsList];
      this.lanesList = ['Top', 'Jungle', 'Mid', 'ADC', 'Support', 'Any'];
      this.filteredLanesList = this.lanesList;
      this.opponentChampionsList = opponentChampionsList;
      this.opponentChampionsListManager = new ListManager(opponentChampionsList, 1);
      this.opponentChampionsSuggestionList = [...opponentChampionsList];
      this.runesListManager = new ListManager(runesList, this.maxRunes);
      this.itemsListManager = new ListManager(championItemsList, this.maxItems);
      this.teamChampionsListManager = new ListManager(teamChampionsList, this.maxTeamChampions);
      this.opponentTeamChampionsListManager = new ListManager(opponentTeamChampionsList, this.maxTeamChampions);
      this.runesList = runesList;
      this.runesSuggestionList = [...runesList];
      this.itemsList = championItemsList;
      this.itemsSuggestionList = [...championItemsList];
      this.teamChampionsList = teamChampionsList;
      this.teamChampionsSuggestionList = teamChampionsList;
      this.opponentTeamChampionsList = opponentTeamChampionsList;
      this.opponentTeamChampionsSuggestionList = opponentTeamChampionsList;
      this.videoList = videoList;
      this.filteredVideoList = [...videoList];
    } catch (error) {
      console.error('Failed to initialize data:', error);
    }
  }

  updateChampionsSuggestionList(event: Event): void {
    this.championsSuggestionList = this.championsListManager.updateList(event);
  }

  // Method to add a champion to the selected list
  selectChampion(champion: string, inputValue: string): void {
    this.championsSuggestionList = this.championsListManager.addItem(champion, inputValue);
    this.selectedChampion = this.championsListManager.selectedItems;
  }

  // Method to remove a champion from the selected list
  removeChampion(champion: string, inputValue?: string) {
    this.championsSuggestionList = this.championsListManager.removeItem(champion, inputValue);
    this.selectedChampion = this.championsListManager.selectedItems;
  }

  updateOpponentChampionsSuggestionList(event: Event): void {
    this.opponentChampionsSuggestionList = this.opponentChampionsListManager.updateList(event);
  }

  selectOpponentChampion(champion: string, inputValue: string): void {
    this.opponentChampionsSuggestionList = this.opponentChampionsListManager.addItem(champion, inputValue);
    this.selectedOpponentChampion = this.opponentChampionsListManager.selectedItems;
  }

  // Method to remove a champion from the selected list
  removeOpponentChampion(champion: string, inputValue?: string) {
    this.opponentChampionsSuggestionList = this.opponentChampionsListManager.removeItem(champion, inputValue);
    this.selectedOpponentChampion = this.opponentChampionsListManager.selectedItems;
  }

  /**
   * updates the runes list that the user can pick from while typing in the input box
   * @param event
   */
  updateRunesSuggestionList(event: Event): void {
    this.runesSuggestionList = this.runesListManager.updateList(event);
  }

  addRune(rune: string, inputValue: string): void {
    this.runesSuggestionList = this.runesListManager.addItem(rune, inputValue);
    this.selectedRunes = this.runesListManager.selectedItems;
  }

  removeRune(rune: string, inputValue?: string) {
    this.runesSuggestionList = this.runesListManager.removeItem(rune, inputValue);
    this.selectedRunes = this.runesListManager.selectedItems;
  }

  /**
   * updates the items list that the user can pick from while typing in the input box
   * @param event
   */
  updateItemsSuggestionList(event: Event): void {
    this.itemsSuggestionList = this.itemsListManager.updateList(event);
  }

  addItem(item: string, inputValue: string): void {
    this.itemsSuggestionList = this.itemsListManager.addItem(item, inputValue);
    this.selectedItems = this.itemsListManager.selectedItems;
  }

  removeItem(item: string, inputValue?: string) {
    this.itemsSuggestionList = this.itemsListManager.removeItem(item, inputValue);
    this.selectedItems = this.itemsListManager.selectedItems;
  }

  /**
   * updates the champion list that the user can pick from while typing in the input box
   * @param event
   */
  updateTeamChampionsSuggestionList(event: Event): void {
    this.teamChampionsSuggestionList = this.teamChampionsListManager.updateList(event);
  }

  // Method to add a champion to the selected list
  addTeamChampion(champion: string, inputValue: string): void {
    this.teamChampionsSuggestionList = this.teamChampionsListManager.addItem(champion, inputValue);
    this.selectedTeamChampions = this.teamChampionsListManager.selectedItems;
  }

  // Method to remove a champion from the selected list
  removeTeamChampion(champion: string, inputValue?: string) {
    this.teamChampionsSuggestionList = this.teamChampionsListManager.removeItem(champion, inputValue);
    this.selectedTeamChampions = this.teamChampionsListManager.selectedItems;
  }

  /**
   * updates the champion list that the user can pick from while typing in the input box
   * @param event
   */
  updateOpponentTeamChampions(event: Event): void {
    this.opponentTeamChampionsSuggestionList = this.opponentTeamChampionsListManager.updateList(event);
  }

  // Method to add a champion to the selected list
  addOpponentTeamChampion(champion: string, inputValue: string): void {
    this.opponentTeamChampionsSuggestionList = this.opponentTeamChampionsListManager.addItem(champion, inputValue);
    this.selectedOpponentTeamChampions = this.opponentTeamChampionsListManager.selectedItems;
  }

  // Method to remove a champion from the selected list
  removeOpponentTeamChampion(champion: string, inputValue?: string) {
    this.opponentTeamChampionsSuggestionList = this.opponentTeamChampionsListManager.removeItem(champion, inputValue);
    this.selectedOpponentTeamChampions = this.opponentTeamChampionsListManager.selectedItems;
  }

  abstract handleSubmit(): void; // To be implemented by child classes
}

