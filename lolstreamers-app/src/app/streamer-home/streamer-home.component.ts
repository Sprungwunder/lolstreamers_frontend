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
  ],
  templateUrl: './streamer-home.component.html',
  styleUrl: './streamer-home.component.css'
})
export class StreamerHomeComponent extends VideoBaseComponent {

  buttonText = "Search"

  constructor(protected override videoService: VideoService) {
    super(videoService);
  }

  ngOnInit() {
    this.initializeData();
  }

  // Filter videos based on the selected champion and other filters
  filterVideos() {
    const {
      lane
    } = this.inputForm.value;
    this.videoService.filterVideos(
      this.selectedChampion.join(',') ?? '',
      lane ?? '',
      this.selectedEnemyChampion.join(',') ?? '',
      this.selectedRunes.join(',') ?? '',
      this.selectedItems.join(',') ?? '',
      this.selectedTeamChampions.join(',') ?? '',
      this.selectedEnemyTeamChampions.join(',') ?? '',
    ).then((videos: Video[]) => {
      this.filteredVideoList = videos;
    }).catch((error) => {
      console.error('Failed to filter videos:', error);
    });
  }

  handleSubmit() {
    this.filterVideos();
  }
}

