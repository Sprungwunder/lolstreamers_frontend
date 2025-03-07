import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {VideoListComponent} from "../video-list/video-list.component";
import {Video} from "../video";
import {VideoService} from "../video.service";
import {AuthService} from "../auth.service";
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-streamer-home',
  standalone: true,
  imports: [CommonModule, VideoListComponent, ReactiveFormsModule],
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
    // Fetch all videos
    this.videoService.getAllVideos().then((videos: Video[]) => {
      this.videoList = videos;
      this.filteredVideoList = videos;
    }).catch((error) => {
      console.error('Failed to fetch video list:', error);
    });

    // Fetch all champions
    this.videoService.getAllChampions().then((champions: string[]) => {
      this.championsList = champions;
      this.filteredChampionsList = champions; // Initially, all champions are displayed
    }).catch((error) => {
      console.error('Failed to fetch champions list:', error);
    });

    // Search-as-you-type functionality for champions
    this.searchForm.controls.championName?.valueChanges
      .pipe(
        debounceTime(300), // Add a debounce to reduce API calls
        distinctUntilChanged() // Avoid repetitive calls for the same value
      )
      .subscribe((value: string | null) => {
        this.filterChampionList(value);
      });
  }

  // Filter champion list based on the user input
  filterChampionList(input: string | null) {
    if (!input) {
      this.filteredChampionsList = this.championsList; // Reset to all champions if input is empty
    } else {
      this.filteredChampionsList = this.championsList.filter(champion =>
        champion.toLowerCase().includes(input.toLowerCase())
      );
    }
  }

  // Filter videos based on the selected champion and other filters
  filterVideos() {
    const {championName, lane, opponentChampion, runes, teamChampions, opponentTeamChampions, championItems} = this.searchForm.value;
    this.videoService.filterVideos(
      championName ?? '',
      lane ?? '',
      opponentChampion ?? '',
      runes ?? '',
      teamChampions ?? '',
      opponentTeamChampions ?? '',
      championItems ?? ''
    ).then((videos: Video[]) => {
      this.filteredVideoList = videos;
    }).catch((error) => {
      console.error('Failed to filter videos:', error);
    });
  }
}
