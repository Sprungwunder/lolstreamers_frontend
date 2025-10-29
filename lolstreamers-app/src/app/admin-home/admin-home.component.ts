import {Component, inject, OnInit} from '@angular/core';
import {RouterModule} from "@angular/router";
import {Video} from "../video";
import {VideoService} from "../video.service";

import {VideoCardComponent} from "../video-card/video-card.component";

@Component({
    selector: 'app-admin-home',
    imports: [RouterModule, VideoCardComponent],
    templateUrl: './admin-home.component.html',
    styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit{
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

  onVideoDeleted(videoId: string) {
    this.videoList = this.videoList.filter(video => video.id !== videoId);
  }

  onVideoActivated(videoId: string) {
    this.videoList = this.videoList.filter(video => video.id !== videoId);
  }
}
