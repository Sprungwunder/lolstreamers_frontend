import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Video} from "../../video";
import {VideoService} from "../../video.service";
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';


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
    youtubeUrl: new FormControl('', [Validators.required, youtubeUrlValidator()]),
  });

  constructor(protected videoService: VideoService) {
  }

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
      console.log('Fetched initial data:', {
        championsList,
        enemyChampionsList: enemyChampionsList,
        runesList,
        championItemsList,
        teamChampionsList,
        enemyTeamChampionsList: enemyTeamChampionsList,
        videoList
      });
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


// YouTube URL validator function
export function youtubeUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    // Extract video ID from different YouTube URL formats
    let videoId: string | null = null;

    // Handle youtube.com/watch?v= format
    const fullUrlRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11}).*$/;
    const fullMatch = control.value.match(fullUrlRegex);

    // Handle youtu.be/ format
    const shortUrlRegex = /^(https?:\/\/)?(www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(\?.*)?$/;
    const shortMatch = control.value.match(shortUrlRegex);

    if (fullMatch && fullMatch[3]) {
      videoId = fullMatch[3];
    } else if (shortMatch && shortMatch[3]) {
      videoId = shortMatch[3];
    }

    // If no valid video ID was extracted, the URL is invalid
    if (!videoId) {
      return { invalidYoutubeUrl: true };
    }

    // Validate the video ID is the correct length
    if (videoId.length !== 11) {
      return { invalidYoutubeId: true };
    }

    return null;
  };
}
