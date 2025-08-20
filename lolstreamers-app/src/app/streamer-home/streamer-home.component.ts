import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from '@angular/forms';
import {VideoCardComponent} from "../video-card/video-card.component";
import {Video} from "../video";
import {VideoBaseComponent} from "../shared/video-base/video-base.component";
import {VideoService} from "../video.service";
import {ChampionNameInputComponent} from "../shared/champion-name-input/champion-name-input.component";
import {
  EnemyChampionNameInputComponent
} from "../shared/enemy-champion-name-input/enemy-champion-name-input.component";
import {RunesInputComponent} from "../shared/runes-input/runes-input.component";
import {ItemsInputComponent} from "../shared/items-input/items-input.component";
import {TeamChampionsInputComponent} from "../shared/team-champions-input/team-champions-input.component";
import {
  EnemyTeamChampionsInputComponent
} from "../shared/enemy-team-champions-input/enemy-team-champions-input.component";
import {LaneInputComponent} from "../shared/lane-input/lane-input.component";
import {StreamerInputComponent} from "../shared/streamer-input/streamer-input.component";

@Component({
  selector: 'app-streamer-home',
  standalone: true,
  imports: [
    CommonModule,
    VideoCardComponent,
    ReactiveFormsModule,
    ChampionNameInputComponent,
    EnemyChampionNameInputComponent,
    RunesInputComponent,
    ItemsInputComponent,
    TeamChampionsInputComponent,
    EnemyTeamChampionsInputComponent,
    LaneInputComponent,
    StreamerInputComponent
  ],
  templateUrl: './streamer-home.component.html',
  styleUrl: './streamer-home.component.css'
})
export class StreamerHomeComponent extends VideoBaseComponent {

  buttonText = "Search"
  isSearching = false;

  constructor(protected override videoService: VideoService) {
    super(videoService);
  }

  ngOnInit() {
    this.initializeData();
  }

  async initializeData() {
    this.videoService.getAllStreamers().then((streamer: string[]) => {
      this.streamerList = streamer;
      this.selectedStreamer = streamer; // Initially, all streamers are in the filtered list
    });
    const videoList = await this.videoService.getAllVideos();
    this.videoList = videoList;
    this.filteredVideoList = [...videoList];
  }

  // Filter videos based on the selected champion and other filters
  filterVideos() {
    this.isSearching = true;
    this.videoService.filterVideos(
      this.selectedChampion.join(',') ?? '',
      this.selectedLane.join(',') ?? '',
      this.selectedEnemyChampion.join(',') ?? '',
      this.selectedRunes.join(',') ?? '',
      this.selectedItems.join(',') ?? '',
      this.selectedTeamChampions.join(',') ?? '',
      this.selectedEnemyTeamChampions.join(',') ?? '',
      this.selectedStreamer.join(',') ?? '',
    ).then((videos: Video[]) => {
      this.filteredVideoList = videos;
      this.isSearching = false;
      this.buttonText = "Search";
    }).catch((error) => {
      console.error('Failed to filter videos:', error);
      this.isSearching = false;
      this.buttonText = "Search";
      alert('Failed to filter videos. Please try again later.');
    });
  }

  handleSubmit() {
    if (this.isSearching) {
      return; // Do nothing if the search is already in progress
    }
    this.filterVideos();
  }

  override onVideoDeleted(_videoId: string) {
    this.filterVideos();
  }

}

