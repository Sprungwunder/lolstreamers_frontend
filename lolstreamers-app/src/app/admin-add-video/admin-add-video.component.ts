import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VideoService } from '../video.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-admin-add-video',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-add-video.component.html',
  styleUrls: ['./admin-add-video.component.css'],
})
export class AdminAddVideoComponent implements OnInit {
  // The form group for YouTube URL and Champion Name
  videoForm: FormGroup;

  // List of all champions fetched from the service
  championsList: string[] = [];

  // Filtered champion suggestions for type-ahead search
  filteredChampions: string[] = [];

  constructor(private formBuilder: FormBuilder, private videoService: VideoService) {
    this.videoForm = this.formBuilder.group({
      youtubeUrl: new FormControl('', [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/)]),
      championName: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    // Fetch the list of champions once the component initializes
    this.fetchChampions();

    // Listen to changes in the champion input for type-ahead functionality
    this.videoForm.get('championName')?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged()) // Debounce to reduce API calls
      .subscribe((query) => {
        this.filterChampions(query);
      });
  }

  // Fetch champions from the API using the VideoService
  private async fetchChampions() {
    try {
      this.championsList = await this.videoService.getAllChampions();
    } catch (error) {
      console.error('Error fetching champions: ', error);
    }
  }

  // Filter champions based on user input
  private filterChampions(query: string): void {
    if (query && query.length > 0) {
      this.filteredChampions = this.championsList.filter((champion) =>
        champion.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.filteredChampions = [];
    }
  }

  // Submit the form
  submitForm(): void {
    if (this.videoForm.valid) {
      const { youtubeUrl, championName } = this.videoForm.value;
      console.log('Submitting:', { youtubeUrl, championName });

      // Here, you can make an API call to save the video and its metadata
      // Example:
      // this.videoService.addVideo({ youtubeUrl, championName });

      alert('Video data submitted successfully!');
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
