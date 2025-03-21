import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {VideoCardComponent} from "../video-card/video-card.component";
import {Video} from "../video";
import {VideoService} from "../video.service";
import {AuthService} from "../auth.service";
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {ListManager} from "../list-manager";

@Component({
  selector: 'app-streamer-home',
  standalone: true,
  imports: [CommonModule, VideoCardComponent, ReactiveFormsModule],
  templateUrl: './streamer-home.component.html',
  styleUrl: './streamer-home.component.css'
})
export class StreamerHomeComponent {
  videoList: Video[] = [];
  filteredVideoList: Video[] = [];
  videoService: VideoService = inject(VideoService);
  authService: AuthService = inject(AuthService);

  championsList: string[] = [];
  filteredChampionsList: string[] = [];

  lanesList: string[] = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];
  filteredLanesList: string[] = [...this.lanesList]; // Initially show all lanes

  opponentChampionsList: string[] = [];
  filteredOpponentChampionsList: string[] = [];

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
  teamChampionsList: string[] = []; // Holds the fetched list of team champions
  teamChampionsSuggestionList: string[] = []; // Holds the filtered list (for search suggestion)
  selectedTeamChampions: string[] = []; // Holds the selected team champions

  // opponent team champions
  opponentTeamChampionsList: string[] = []; // Holds the fetched list of opponent team champions
  opponentTeamChampionsSuggestionList: string[] = []; // Holds the filtered list (for search suggestion)
  selectedOpponentTeamChampions: string[] = []; // Holds the selected opponent team champions

  // Search form controls
  searchForm = new FormGroup({
    championName: new FormControl(''),
    lane: new FormControl(''),
    opponentChampion: new FormControl(''),
    runes: new FormControl(''),
    championItems: new FormControl(''),
    teamChampions: new FormControl(''),
    opponentTeamChampions: new FormControl(''),
  });

  ngOnInit() {
    this.authService.login("christian", "3rg0PRO!").subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        console.log('Login successful:', response);
      },
      error: (error) => console.error('Login failed:', error)
    });
    this.initializeData();
    this.initSearchAsYouType();
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

      this.championsList = championsList;
      this.filteredChampionsList = championsList;
      this.opponentChampionsList = opponentChampionsList;
      this.filteredOpponentChampionsList = opponentChampionsList;
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

  async initSearchAsYouType() {
    this.searchForm.controls.championName?.valueChanges
      .pipe(
        debounceTime(300), // Add a debounce to reduce API calls
        distinctUntilChanged() // Avoid repetitive calls for the same value
      )
      .subscribe((value: string | null) => {
        this.filterChampionList(value);
      });

    this.searchForm.controls.lane?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value: string | null) => {
        this.filterLaneList(value);
      });

    this.searchForm.controls.opponentChampion?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value: string | null) => {
        this.filterOpponentChampionList(value);
      });
  }

  // Filter lists based on input
  filterChampionList(input: string | null) {
    if (!input) {
      this.filteredChampionsList = this.championsList; // Reset to all champions if input is empty
    } else {
      this.filteredChampionsList = this.championsList.filter(champion =>
        champion.toLowerCase().includes(input.toLowerCase())
      );
    }
  }

  filterLaneList(input: string | null) {
    this.filteredLanesList = !input
      ? this.lanesList
      : this.lanesList.filter((lane) =>
        lane.toLowerCase().includes(input)
      );
  }

  filterOpponentChampionList(input: string | null) {
    this.filteredOpponentChampionsList = !input
      ? this.opponentChampionsList
      : this.opponentChampionsList.filter((opponentChampion) =>
        opponentChampion.toLowerCase().includes(input.toLowerCase())
      );
  }

  updateRunesSuggestion(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.runesSuggestionList = this.runesList.filter((rune) =>
      rune.toLowerCase().includes(input)
    );
  }

  addRune(rune: string, inputValue: string): void {
    if (!this.selectedRunes.includes(rune)) {
      this.selectedRunes.push(rune);
    }
    this.runesSuggestionList = this.runesList.filter(
      rune => rune.toLowerCase().includes(inputValue.toLowerCase()) &&
        !this.selectedRunes.includes(rune)
    );
  }

  removeRune(rune: string, inputValue?: string): void {
    this.selectedRunes = this.selectedRunes.filter(
      (selectedRune) => selectedRune !== rune
    );
    let filtered = !inputValue
      ? this.runesList
      : this.runesList.filter((rune) =>
        rune.toLowerCase().includes(inputValue.toLowerCase())
      );
    this.runesSuggestionList = filtered.filter(
      (rune) => !this.selectedRunes.includes(rune)
    );
  }

  /**
   * updates the items list that the user can pick from while typing in the input box
   * @param event
   */
  updateItemssSuggestionList(event: Event): void {
    const inputElement = event.target as HTMLInputElement; // Cast here
    const searchTerm = inputElement.value; // Get the value of the input
    this.itemsListManager.filterItems(searchTerm);
    this.itemsSuggestionList = this.itemsListManager.suggestionList;
  }

  addItem(item: string, inputValue: string): void {
    this.itemsListManager.selectItem(item);
    this.itemsListManager.clearSuggestions(inputValue);
    this.selectedItems = this.itemsListManager.selecteditems;
    this.itemsSuggestionList = this.itemsListManager.suggestionList;
  }

  removeItem(item: string, inputValue?: string) {
    this.itemsListManager.deselectItem(item);
    this.selectedItems = this.itemsListManager.selecteditems;
    this.itemsListManager.filterItems(inputValue || '');
    this.itemsSuggestionList = this.itemsListManager.suggestionList;
  }

  /**
   * updates the champion list that the user can pick from while typing in the input box
   * @param event
   */
  updateTeamChampionsSuggestionList(event: Event): void {
    const inputElement = event.target as HTMLInputElement; // Cast here
    const searchTerm = inputElement.value; // Get the value of the input
    this.teamChampionsListManager.filterItems(searchTerm);
    this.teamChampionsSuggestionList = this.teamChampionsListManager.suggestionList;
  }

  // Method to add a champion to the selected list
  addTeamChampion(champion: string, inputValue: string): void {
    this.teamChampionsListManager.selectItem(champion);
    this.teamChampionsListManager.clearSuggestions(inputValue);
    this.selectedTeamChampions = this.teamChampionsListManager.selecteditems;
    this.teamChampionsSuggestionList = this.teamChampionsListManager.suggestionList;
  }

  // Method to remove a champion from the selected list
  removeTeamChampion(champion: string, inputValue?: string) {
    this.teamChampionsListManager.deselectItem(champion);
    this.selectedTeamChampions = this.teamChampionsListManager.selecteditems;
    this.teamChampionsListManager.filterItems(inputValue || '');
    this.teamChampionsSuggestionList = this.teamChampionsListManager.suggestionList;
  }

  /**
   * updates the champion list that the user can pick from while typing in the input box
   * @param event
   */
  updateOpponentTeamChampions(event: Event): void {
    const inputElement = event.target as HTMLInputElement; // Cast here
    const searchTerm = inputElement.value; // Get the value of the input
    this.opponentTeamChampionsListManager.filterItems(searchTerm);
    this.opponentTeamChampionsSuggestionList = this.opponentTeamChampionsListManager.suggestionList;
  }

  // Method to add a champion to the selected list
  addOpponentTeamChampion(champion: string, inputValue: string): void {
    this.opponentTeamChampionsListManager.selectItem(champion);
    this.opponentTeamChampionsListManager.clearSuggestions(inputValue);
    this.selectedOpponentTeamChampions = this.opponentTeamChampionsListManager.selecteditems;
    this.opponentTeamChampionsSuggestionList = this.opponentTeamChampionsListManager.suggestionList;
  }

  // Method to remove a champion from the selected list
  removeOpponentTeamChampion(champion: string, inputValue?: string) {
    this.opponentTeamChampionsListManager.deselectItem(champion);
    this.selectedOpponentTeamChampions = this.opponentTeamChampionsListManager.selecteditems;
    this.opponentTeamChampionsListManager.filterItems(inputValue || '');
    this.opponentTeamChampionsSuggestionList = this.opponentTeamChampionsListManager.suggestionList;
  }

  // Filter videos based on the selected champion and other filters
  filterVideos() {
    const selectedChampionsString = this.teamChampionsListManager.getAsCommaSeparatedString();
    const selectedOpponentChampionsString = this.opponentTeamChampionsListManager.getAsCommaSeparatedString();
    const selectedRunesString = this.selectedRunes.join(',');
    const selectedItemsString = this.itemsListManager.getAsCommaSeparatedString();

    const {
      championName,
      lane,
      opponentChampion,
      championItems
    } = this.searchForm.value;
    this.videoService.filterVideos(
      championName ?? '',
      lane ?? '',
      opponentChampion ?? '',
      selectedRunesString ?? '',
      selectedItemsString ?? '',
      selectedChampionsString ?? '',
      selectedOpponentChampionsString ?? '',
    ).then((videos: Video[]) => {
      this.filteredVideoList = videos;
    }).catch((error) => {
      console.error('Failed to filter videos:', error);
    });
  }
}

