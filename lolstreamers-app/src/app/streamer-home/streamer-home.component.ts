import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from '@angular/forms';
import {VideoCardComponent} from "../video-card/video-card.component";
import {Video} from "../video";
import {VideoBaseComponent} from "../shared/video-base/video-base.component";
import {VideoService} from "../video.service";

@Component({
  selector: 'app-streamer-home',
  standalone: true,
  imports: [CommonModule, VideoCardComponent, ReactiveFormsModule],
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
      this.championsListManager.getAsCommaSeparatedString() ?? '',
      lane ?? '',
      this.opponentChampionsListManager.getAsCommaSeparatedString() ?? '',
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

  handleSubmit() {
    this.filterVideos();
  }
}

