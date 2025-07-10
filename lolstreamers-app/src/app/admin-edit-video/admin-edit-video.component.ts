import {Component, inject} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {VideoService} from "../video.service";
import {Video} from "../video";
import {VideoCardComponent} from "../video-card/video-card.component";
import {CommonModule} from "@angular/common";
import {Router} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";


@Component({
  selector: 'app-admin-edit-video',
  standalone: true,
  imports: [
    VideoCardComponent,
    CommonModule
  ],
  templateUrl: './admin-edit-video.component.html',
  styleUrl: './admin-edit-video.component.css'
})
export class AdminEditVideoComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  videoService: VideoService = inject(VideoService);
  video: Video | undefined;
  private router = inject(Router);
  safeSrc: SafeResourceUrl | undefined;


  constructor(private sanitizer: DomSanitizer) {
    const videoId = String(this.route.snapshot.params['id']);
    this.videoService.getVideoById(videoId).then(video => {
      this.video = video;
      if (this.video) {
        this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
          "https://www.youtube.com/embed/" + this.video.ytid + "?start=" + this.video.timestamp
        );
      }
    });

  }

  activateVideo(): void {
    if (!this.video || !this.video.id) {
      console.error('Video data is missing or invalid.');
      return;
    }

    // Assuming the video service method to be `activateVideoById`
    this.videoService.activateVideoById(this.video.id)
      .then(() => {
        console.log('Video activation request sent successfully!');
        alert('Video activated successfully!');
        this.router.navigate(['/admin']);
      })
      .catch((error) => {
        console.error('Error activating video:', error);
        alert('Failed to activate video. Please try again later.');
      });
  }

}
