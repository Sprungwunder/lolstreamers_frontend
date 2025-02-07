import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {VideoListComponent} from "../video-list/video-list.component";
import {Video} from "../video";
import {VideoService} from "../video.service";
import {AuthService} from "../auth.service";

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
  authService: AuthService = inject(AuthService);
  applyForm = new FormGroup({
    id: new FormControl(''),
  });

  ngOnInit() {
    this.authService.login("christian", "3rg0PRO!").subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        console.log('Login successful:', response);
      },
      error: (error) => console.error('Login failed:', error)
    });

    this.videoService.getAllVideos().then((videos: Video[]) => {
      this.videoList = videos;
      this.filteredVideoList = videos;
    });
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
