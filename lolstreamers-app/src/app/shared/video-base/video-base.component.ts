import {FormControl, FormGroup} from '@angular/forms';
import {Video} from "../../video";
import {ListManager} from "../../list-manager";
import {VideoService} from "../../video.service";


export abstract class VideoBaseComponent {
  videoList: Video[] = [];
  filteredVideoList: Video[] = [];

  // champions
  championsList: string[] = []; // Holds the fetched list of champions
  selectedChampion: string[] = []; // Holds the selected champion

  // opponent champions
  opponentChampionsList: string[] = [];
  selectedOpponentChampion: string[] = [];

  lanesList: string[] = [];
  filteredLanesList: string[] = []; // Initially show all lanes

  teamChampionsListManager!: ListManager;
  opponentTeamChampionsListManager!: ListManager;
  private readonly maxTeamChampions = 4;

  // Runes Management
  runesList: string[] = [];
  selectedRunes: string[] = [];

  // Items
  itemsList: string[] = [];
  selectedItems: string[] = [];

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
      this.lanesList = ['Top', 'Jungle', 'Mid', 'ADC', 'Support', 'Any'];
      this.filteredLanesList = this.lanesList;
      this.opponentChampionsList = opponentChampionsList;
      this.teamChampionsListManager = new ListManager(teamChampionsList, this.maxTeamChampions);
      this.opponentTeamChampionsListManager = new ListManager(opponentTeamChampionsList, this.maxTeamChampions);
      this.runesList = runesList;
      this.itemsList = championItemsList;
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


  /**
   * updates the champion list that the user can pick from while typing in the input box
   * @param event
   */
  updateTeamChampionsSuggestionList(event: Event): void {
    this.teamChampionsSuggestionList = this.teamChampionsListManager.updateListFromEvent(event);
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
    this.opponentTeamChampionsSuggestionList = this.opponentTeamChampionsListManager.updateListFromEvent(event);
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

