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

    this.videoService.activateVideoById(this.video.id)
      .then((result) => {
        if (result.success) {
          console.log('Video activation request sent successfully!');
          alert('Video activated successfully!');
          this.router.navigate(['/adm']);
        } else {
          console.error('Error activating video:', result.message);
          if (result.message.includes('Authentication required')) {
            // If it's an authentication error, redirect to login
            alert('Your session has expired. Please log in again.');
            this.router.navigate(['/login']);
          } else {
            alert(`Failed to activate video: ${result.message}`);
          }
        }
      })
      .catch((error) => {
        console.error('Unexpected error activating video:', error);
        alert('An unexpected error occurred. Please try again later.');
      });

  }

}
