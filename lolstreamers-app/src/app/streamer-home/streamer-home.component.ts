import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from '@angular/forms';
import {VideoCardComponent} from "../video-card/video-card.component";
import {Video} from "../video";
import {VideoBaseComponent} from "../shared/video-base/video-base.component";
import {VideoService} from "../video.service";
import {ChampionNameInput} from "../shared/champion-name-input/champion-name-input.component";
import {OpponentChampionNameInput} from "../shared/opponent-champion-name-input/opponent-champion-name-input.component";

@Component({
  selector: 'app-streamer-home',
  standalone: true,
  imports: [CommonModule, VideoCardComponent, ReactiveFormsModule, ChampionNameInput, OpponentChampionNameInput],
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
      this.itemsListManager.getAsCommaSeparatedString() ?? '',
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

  handleSubmit() {
    this.filterVideos();
  }
}

