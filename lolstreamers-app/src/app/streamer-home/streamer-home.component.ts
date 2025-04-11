import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from '@angular/forms';
import {VideoCardComponent} from "../video-card/video-card.component";
import {Video} from "../video";
import {VideoBaseComponent} from "../shared/video-base/video-base.component";
import {VideoService} from "../video.service";
import {ChampionNameInputComponent} from "../shared/champion-name-input/champion-name-input.component";
import {
  OpponentChampionNameInputComponent
} from "../shared/opponent-champion-name-input/opponent-champion-name-input.component";
import {RunesInputComponent} from "../shared/runes-input/runes-input.component";
import {ItemsInputComponent} from "../shared/items-input/items-input.component";

@Component({
  selector: 'app-streamer-home',
  standalone: true,
  imports: [
    CommonModule,
    VideoCardComponent,
    ReactiveFormsModule,
    ChampionNameInputComponent,
    OpponentChampionNameInputComponent,
    RunesInputComponent,
    ItemsInputComponent,
  ],
  templateUrl: './streamer-home.component.html',
  styleUrl: './streamer-home.component.css'
})
export class StreamerHomeComponent extends VideoBaseComponent {

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
    } = this.searchForm.value;
    this.videoService.filterVideos(
      this.selectedChampion.join(',') ?? '',
      lane ?? '',
      this.selectedOpponentChampion.join(',') ?? '',
      this.selectedRunes.join(',') ?? '',
      this.selectedItems.join(',') ?? '',
      this.teamChampionsListManager.getAsCommaSeparatedString() ?? '',
      this.opponentTeamChampionsListManager.getAsCommaSeparatedString() ?? '',
    ).then((videos: Video[]) => {
      this.filteredVideoList = videos;
    }).catch((error) => {
      console.error('Failed to filter videos:', error);
    });
  }

  // Handle Champion changes from the reusable component
  handleChampionChange(selectedChampions: string[]): void {
    this.selectedChampion = selectedChampions;
  }

  handleOpponentChampionChange(selectedChampions: string[]): void {
    this.selectedOpponentChampion = selectedChampions;
  }

  handleRunesChange(selectedRunes: string[]): void {
    this.selectedRunes = selectedRunes;
  }

  handleItemsChange(selectedItems: string[]): void {
    this.selectedItems = selectedItems;
  }

  handleSubmit() {
    this.filterVideos();
  }
}

