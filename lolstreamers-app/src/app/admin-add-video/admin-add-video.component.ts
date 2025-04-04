import {Component, inject, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {VideoService} from '../video.service';
import {ListManager} from "../list-manager";

@Component({
  selector: 'app-admin-add-video',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-add-video.component.html',
  styleUrls: ['./admin-add-video.component.css'],
})
export class AdminAddVideoComponent implements OnInit {
  videoService: VideoService = inject(VideoService);

  // The form group for YouTube URL and Champion Name
  videoForm = new FormGroup({
    youtubeUrl: new FormControl('', [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/)]),
    championName: new FormControl('', []),
  });

  // champions
  championsListManager!: ListManager;
  championsList: string[] = []; // Holds the fetched list of champions
  championsSuggestionList: string[] = []; // Holds the filtered list (for search suggestion)
  selectedChampion: string[] = []; // Holds the selected champion


  ngOnInit(): void {
    // Fetch the list of champions once the component initializes
    this.initializeData();
  }

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
    } catch (error) {
      console.error('Failed to initialize data:', error);
    }
  }

  updateChampionsSuggestionList(event: Event): void {
    const inputElement = event.target as HTMLInputElement; // Cast here
    const searchTerm = inputElement.value; // Get the value of the input
    this.championsListManager.filterItems(searchTerm);
    this.championsSuggestionList = this.championsListManager.suggestionList;
  }

  // Method to add a champion to the selected list
  selectChampion(champion: string, inputValue: string): void {
    this.championsListManager.selectItem(champion);
    this.championsListManager.clearSuggestions(inputValue);
    this.selectedChampion = this.championsListManager.selectedItems;
    this.championsSuggestionList = this.championsListManager.suggestionList;
  }

  // Method to remove a champion from the selected list
  removeChampion(champion: string, inputValue?: string) {
    this.championsListManager.deselectItem(champion);
    this.selectedChampion = this.championsListManager.selectedItems;
    this.championsListManager.filterItems(inputValue || '');
    this.championsSuggestionList = this.championsListManager.suggestionList;
  }

  // Submit the form
  submitForm(): void {
    if (this.videoForm.valid) {
      const {youtubeUrl} = this.videoForm.value;
      console.log('Submitting:', youtubeUrl, this.selectedChampion[0]);

      // Here, you can make an API call to save the video and its metadata
      // Example:
      // this.videoService.addVideo({ youtubeUrl, championName });

      alert('Video data submitted successfully!');
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
