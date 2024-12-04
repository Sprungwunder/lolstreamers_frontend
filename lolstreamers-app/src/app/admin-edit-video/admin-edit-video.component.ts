import {Component, inject} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {VideoService} from "../video.service";
import {Video} from "../video";

@Component({
  selector: 'app-admin-edit-video',
  standalone: true,
  imports: [],
  templateUrl: './admin-edit-video.component.html',
  styleUrl: './admin-edit-video.component.css'
})
export class AdminEditVideoComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  videoService: VideoService= inject(VideoService);
  video: Video | undefined;

  constructor() {
    const videoId = String(this.route.snapshot.params['id']);
    this.videoService.getVideoById(videoId).then(video => {
      this.video = video;
    });
  }
}
