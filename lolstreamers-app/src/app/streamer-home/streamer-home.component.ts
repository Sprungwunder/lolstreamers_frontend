import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {VideoListComponent} from "../video-list/video-list.component";
import {Video} from "../video";
import {VideoService} from "../video.service";
import {AuthService} from "../auth.service";

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
  applyForm = new FormGroup({
    id: new FormControl(''),
  });
  searchForm = new FormGroup({
    championName: new FormControl(''),
    lane: new FormControl(''),
    opponentChampion: new FormControl(''),
    runes: new FormControl(''),
    teamChampions: new FormControl(''),
    opponentTeamChampions: new FormControl(''),
    championItems: new FormControl(''),
  });


  championsList: string[] = [];

  ngOnInit() {
    this.authService.login("christian", "3rg0PRO!").subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        console.log('Login successful:', response);
      },
      error: (error) => console.error('Login failed:', error)
    });

    this.videoService.getAllVideos().then((videos: Video[]) => {
      this.videoList = videos;
      this.filteredVideoList = videos;
    });

    this.videoService.getAllChampions().then((champions: string[]) => {
      this.championsList = champions;
    }).catch((error) => {
      console.error('Failed to fetch champions list:', error);
    });
  }

  submitForm() {
    this.videoService.submitSearch(this.applyForm.value.id ?? '');
  }

  filterVideos() {
    console.log("Submitted champion:", this.searchForm.value.championName ?? '');
    console.log("Submitted lane:", this.searchForm.value.lane ?? '');
    console.log("Submitted lane:", this.searchForm.value.opponentChampion ?? '');
    console.log("Submitted lane:", this.searchForm.value.runes ?? '');
    this.videoService.filterVideos(
      this.searchForm.value.championName ?? '',
      this.searchForm.value.lane ?? '',
      this.searchForm.value.opponentChampion ?? '',
      this.searchForm.value.runes ?? '',
      this.searchForm.value.teamChampions ?? '',
      this.searchForm.value.opponentTeamChampions ?? '',
      this.searchForm.value.championItems ?? '',
    ).then((videos: Video[]) => {
      this.filteredVideoList = videos
    });
  }
}
