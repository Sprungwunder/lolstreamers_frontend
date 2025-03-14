import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {VideoCardComponent} from "../video-card/video-card.component";
import {Video} from "../video";
import {VideoService} from "../video.service";
import {AuthService} from "../auth.service";
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

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

  teamChampionsList: string[] = []; // Holds the fetched list of team champions
  filteredTeamChampionsList: string[] = []; // Holds the filtered list (for search)
  selectedTeamChampions: string[] = []; // Holds the selected team champions
  // Restrict the max count for selected champions
  private readonly maxTeamChampions = 4;


  opponentTeamChampionsList: string[] = []; // Holds the fetched list of opponent team champions
  filteredOpponentTeamChampionsList: string[] = []; // Holds the filtered list (for search)
  selectedOpponentTeamChampions: string[] = []; // Holds the selected opponent team champions
  private readonly maxOpponentChampions = 4;


  // Search form controls
  searchForm = new FormGroup({
    championName: new FormControl(''),
    lane: new FormControl(''),
    opponentChampion: new FormControl(''),
    runes: new FormControl(''),
    teamChampions: new FormControl(''),
    opponentTeamChampions: new FormControl(''),
    championItems: new FormControl(''),
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
        teamChampionsList,
        opponentTeamChampionsList,
        videoList,
      ] = await this.videoService.fetchInitialData();

      this.championsList = championsList;
      this.filteredChampionsList = championsList;
      this.opponentChampionsList = opponentChampionsList;
      this.filteredOpponentChampionsList = opponentChampionsList;
      this.teamChampionsList = teamChampionsList;
      this.filteredTeamChampionsList = teamChampionsList;
      this.opponentTeamChampionsList = opponentTeamChampionsList;
      this.filteredOpponentTeamChampionsList = opponentTeamChampionsList;
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

  // Method to filter champions as user types in the input field
  filterTeamChampions(searchTerm: string): void {
    // Filter champions based on search term
    let filtered = !searchTerm
      ? this.teamChampionsList
      : this.teamChampionsList.filter((champion) =>
        champion.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Further filter out already selected champions
    this.filteredTeamChampionsList = filtered.filter(
      (champion) => !this.selectedTeamChampions.includes(champion)
    );
  }


  filterTeamChampionsFromEvent(event: Event): void {
    const inputElement = event.target as HTMLInputElement; // Cast here
    const searchTerm = inputElement.value; // Get the value of the input
    this.filterTeamChampions(searchTerm); // Call the existing filterChampions method
  }


  // Method to add a champion to the selected list
  addTeamChampion(champion: string, inputValue: string): void {
    if (this.selectedTeamChampions.length < this.maxTeamChampions && !this.selectedTeamChampions.includes(champion)) {
      this.selectedTeamChampions.push(champion);
      this.clearSuggestions(inputValue, 'team');
    } else {
      alert(`You can only select up to ${this.maxTeamChampions} team champions.`);
    }
  }


  addTeamChampionAndClearInput(event: Event) {
    const inputElement = event.target as HTMLInputElement; // Cast the event target to HTMLInputElement
    const champion = inputElement.value.trim(); // Get and trim the input value

    if (champion) {
      this.addTeamChampion(champion, champion); // Call the addChampion method
      inputElement.value = ''; // Clear the input field after adding the champion
    }
  }

  // Method to remove a champion from the selected list
  removeTeamChampion(champion: string, inputValue?: string) {
    this.selectedTeamChampions = this.selectedTeamChampions.filter(
      (c) => c !== champion
    );
    this.filterTeamChampions(inputValue || '');
  }

  // Method to pass the selected champions as a comma-separated string
  getCommaSeparatedTeamChampions(): string {
    return this.selectedTeamChampions.join(',');
  }

  filterOpponentTeamChampions(searchTerm: string): void {
    // Filter champions based on search term
    let filtered = !searchTerm
      ? this.opponentTeamChampionsList
      : this.opponentTeamChampionsList.filter((champion) =>
        champion.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Further filter out already selected champions
    this.filteredOpponentTeamChampionsList = filtered.filter(
      (champion) => !this.selectedOpponentTeamChampions.includes(champion)
    );
  }
  filterOpponentTeamChampionsFromEvent(event: Event): void {
    const inputElement = event.target as HTMLInputElement; // Cast here
    const searchTerm = inputElement.value; // Get the value of the input
    this.filterOpponentTeamChampions(searchTerm); // Call the existing filterChampions method
  }


  // Method to add a champion to the selected list
  addOpponentTeamChampion(champion: string, inputValue: string): void {
    if (this.selectedOpponentTeamChampions.length < this.maxOpponentChampions && !this.selectedOpponentTeamChampions.includes(champion)) {
      this.selectedOpponentTeamChampions.push(champion);
      this.clearSuggestions(inputValue, 'opponent');
    } else {
      alert(`You can only select up to ${this.maxOpponentChampions} opponent champions.`);
    }
  }


  addOpponentTeamChampionAndClearInput(event: Event) {
    const inputElement = event.target as HTMLInputElement; // Cast the event target to HTMLInputElement
    const champion = inputElement.value.trim(); // Get and trim the input value

    if (champion) {
      this.addOpponentTeamChampion(champion, champion); // Call the addChampion method
      inputElement.value = ''; // Clear the input field after adding the champion
    }
  }

  // Method to remove a champion from the selected list
  removeOpponentTeamChampion(champion: string, inputValue?: string) {
    this.selectedOpponentTeamChampions = this.selectedOpponentTeamChampions.filter(
      (c) => c !== champion
    );
    this.filterOpponentTeamChampions(inputValue || '');
  }

  // Method to pass the selected champions as a comma-separated string
  getCommaSeparatedOpponentTeamChampions(): string {
    return this.selectedOpponentTeamChampions.join(',');
  }

  private clearSuggestions(inputValue: string, type: 'team' | 'opponent'): void {
    if (type === 'team') {
      this.filteredTeamChampionsList = this.teamChampionsList.filter(
        champion => champion.toLowerCase().includes(inputValue.toLowerCase()) &&
          !this.selectedTeamChampions.includes(champion)
      );
    } else if (type === 'opponent') {
      this.filteredOpponentTeamChampionsList = this.opponentTeamChampionsList.filter(
        champion => champion.toLowerCase().includes(inputValue.toLowerCase()) &&
          !this.selectedOpponentTeamChampions.includes(champion)
      );
    }
  }


  // Filter videos based on the selected champion and other filters
  filterVideos() {
    const selectedChampionsString = this.getCommaSeparatedTeamChampions();
    const selectedOpponentChampionsString = this.getCommaSeparatedOpponentTeamChampions();

    const {
      championName,
      lane,
      opponentChampion,
      runes,
      championItems
    } = this.searchForm.value;
    this.videoService.filterVideos(
      championName ?? '',
      lane ?? '',
      opponentChampion ?? '',
      runes ?? '',
      selectedChampionsString ?? '',
      selectedOpponentChampionsString ?? '',
      championItems ?? ''
    ).then((videos: Video[]) => {
      this.filteredVideoList = videos;
    }).catch((error) => {
      console.error('Failed to filter videos:', error);
    });
  }
}
