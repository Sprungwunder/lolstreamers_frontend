import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {VideoListComponent} from "../video-list/video-list.component";
import {Video} from "../video";
import {VideoService} from "../video.service";

@Component({
  selector: 'app-streamer-home',
  standalone: true,
  imports: [CommonModule, VideoListComponent, ReactiveFormsModule],
  templateUrl: './streamer-home.component.html',
  styleUrl: './streamer-home.component.css'
})
export class StreamerHomeComponent {
  videoList: Video[] = [];
  filteredVideoList: Video[] = [];
  videoService: VideoService = inject(VideoService);
  applyForm = new FormGroup({
    id: new FormControl(''),
  });

  constructor() {
    this.videoService.getAllVideos().then((videos: Video[]) => {
      this.videoList = videos;
      this.filteredVideoList = videos;
    })
  }

  submitForm() {
    this.videoService.submitSearch(this.applyForm.value.id ?? '');
  }

  filterVideos(id:string) {
    if (!id) {
      this.filteredVideoList = this.videoList;
      return;
    }
    this.filteredVideoList = this.videoList.filter(video => video.id === id);
  }
}
