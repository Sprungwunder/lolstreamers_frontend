import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Video} from "../../video";
import {VideoService} from "../../video.service";


export abstract class VideoBaseComponent {
  hasYoutubeUrl = false;

  videoList: Video[] = [];
  filteredVideoList: Video[] = [];

  // champions
  championsList: string[] = []; // Holds the fetched list of champions
  selectedChampion: string[] = []; // Holds the selected champion

  // enemy champions
  enemyChampionsList: string[] = [];
  selectedEnemyChampion: string[] = [];

  lanesList: string[] = [];
  filteredLanesList: string[] = []; // Initially show all lanes


  // Runes Management
  runesList: string[] = [];
  selectedRunes: string[] = [];

  // Items
  itemsList: string[] = [];
  selectedItems: string[] = [];

  // team champions
  teamChampionsList: string[] = [];
  selectedTeamChampions: string[] = [];

  // enemy team champions
  enemyTeamChampionsList: string[] = [];
  selectedEnemyTeamChampions: string[] = [];

  // Search form controls
  inputForm = new FormGroup({
    championName: new FormControl(''),
    lane: new FormControl(''),
    enemyChampionName: new FormControl(''),
    runes: new FormControl(''),
    championItems: new FormControl(''),
    teamChampions: new FormControl(''),
    enemyTeamChampions: new FormControl(''),
    youtubeUrl: new FormControl('', [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/)]),
  });

  constructor(protected videoService: VideoService) {}

  async initializeData() {
    try {
      const [
        championsList,
        enemyChampionsList,
        runesList,
        championItemsList,
        teamChampionsList,
        enemyTeamChampionsList,
        videoList,
      ] = await this.videoService.fetchInitialData();
      console.log('Fetched initial data:', {championsList, enemyChampionsList: enemyChampionsList, runesList, championItemsList, teamChampionsList, enemyTeamChampionsList: enemyTeamChampionsList, videoList});
      this.championsList = championsList;
      this.lanesList = ['Top', 'Jungle', 'Mid', 'ADC', 'Support', 'Any'];
      this.filteredLanesList = this.lanesList;
      this.enemyChampionsList = enemyChampionsList;
      this.runesList = runesList;
      this.itemsList = championItemsList;
      this.teamChampionsList = teamChampionsList;
      this.enemyTeamChampionsList = enemyTeamChampionsList;
      this.videoList = videoList;
      this.filteredVideoList = [...videoList];
    } catch (error) {
      console.error('Failed to initialize data:', error);
    }
  }

  // Handle Champion changes from the reusable component
  handleChampionChange(selectedChampions: string[]): void {
    this.selectedChampion = selectedChampions;
  }

  handleEnemyChampionChange(selectedChampions: string[]): void {
    this.selectedEnemyChampion = selectedChampions;
  }

  handleRunesChange(selectedRunes: string[]): void {
    this.selectedRunes = selectedRunes;
  }

  handleItemsChange(selectedItems: string[]): void {
    this.selectedItems = selectedItems;
  }

  handleTeamChampionsChange(selectedTeamChampions: string[]): void {
    this.selectedTeamChampions = selectedTeamChampions;
  }

  handleEnemyTeamChampionsChange(selectedTeamChampions: string[]): void {
    this.selectedEnemyTeamChampions = selectedTeamChampions;
  }

  abstract handleSubmit(): void; // To be implemented by child classes
}

