import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Video} from "../video";
import {CommonModule} from "@angular/common";
import {AuthService} from "../auth.service";
import {RouterModule} from "@angular/router";
import {VideoService} from "../video.service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.css'
})
export class VideoCardComponent {
 @Input() video!: Video;
 @Output() videoDeleted = new EventEmitter<string>();
 @Output() videoActivated = new EventEmitter<string>();


  constructor(
    public authService: AuthService,
    private videoService: VideoService
  ) {}

  deleteVideo(): void {
    const confirmed = confirm(`Are you sure you want to delete "${this.video.title}"?`);

    if (confirmed) {
      this.videoService.deleteVideo(this.video.id).subscribe({
        next: () => {
          this.videoDeleted.emit(this.video.id);
        },
        error: (error) => {
          console.error('Error deleting video:', error);
          alert('Error deleting video. Please try again.');
        }
      });
    }
  }

  activateVideo(): void {
    if (!this.video || !this.video.id) {
      return;
    }

    this.videoService.activateVideoById(this.video.id)
      .then((result) => {
        if (result.success) {
          alert('Video activated successfully!');
          this.videoActivated.emit(this.video.id);
        } else {
          console.error('Error activating video:', result.message);
          if (result.message.includes('Authentication required')) {
            alert('Your session has expired. Please log in again.');
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
