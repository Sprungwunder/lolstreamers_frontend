import {Component, inject} from '@angular/core';
import {RouterModule} from "@angular/router";
import {Video} from "../video";
import {VideoService} from "../video.service";
import {NgForOf} from "@angular/common";
import {VideoCardComponent} from "../video-card/video-card.component";

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [RouterModule, NgForOf, VideoCardComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {
  videoService: VideoService = inject(VideoService);
  videoList: Video[] = [];

  ngOnInit() {
    this.getInactiveVideos();
  }

  getInactiveVideos() {
    this.videoService.getInactiveVideos().then((videos: Video[]) => {
      this.videoList = videos;
    }).catch((error) => {
      console.error('Failed to get videos:', error);
    });
  }

  onVideoDeleted(_videoId: string) {
    this.getInactiveVideos();
  }

  onVideoActivated(_videoId: string) {
    this.getInactiveVideos();
  }
}
