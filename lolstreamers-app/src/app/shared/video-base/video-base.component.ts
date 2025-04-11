import {FormControl, FormGroup} from '@angular/forms';
import {Video} from "../../video";
import {VideoService} from "../../video.service";


export abstract class VideoBaseComponent {
  videoList: Video[] = [];
  filteredVideoList: Video[] = [];

  // champions
  championsList: string[] = []; // Holds the fetched list of champions
  selectedChampion: string[] = []; // Holds the selected champion

  // opponent champions
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

  // opponent team champions
  opponentTeamChampionsList: string[] = [];
  selectedOpponentTeamChampions: string[] = [];

  // Search form controls
  searchForm = new FormGroup({
    championName: new FormControl(''),
    lane: new FormControl(''),
    enemyChampionName: new FormControl(''),
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
      this.enemyChampionsList = opponentChampionsList;
      this.runesList = runesList;
      this.itemsList = championItemsList;
      this.teamChampionsList = teamChampionsList;
      this.opponentTeamChampionsList = opponentTeamChampionsList;
      this.videoList = videoList;
      this.filteredVideoList = [...videoList];
    } catch (error) {
      console.error('Failed to initialize data:', error);
    }
  }

  abstract handleSubmit(): void; // To be implemented by child classes
}

