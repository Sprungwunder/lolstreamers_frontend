import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {VideoService} from '../video.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-admin-add-video',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-add-video.component.html',
  styleUrls: ['./admin-add-video.component.css'],
})
export class AdminAddVideoComponent implements OnInit {
  videoService: VideoService = inject(VideoService);

  // The form group for YouTube URL and Champion Name
  videoForm = new FormGroup({
    youtubeUrl: new FormControl('', [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/)]),
    championName: new FormControl('', Validators.required),
  });

  // List of all champions fetched from the service
  championsList: string[] = [];

  // Filtered champion suggestions for type-ahead search
  filteredChampionsList: string[] = [];


  ngOnInit(): void {
    // Fetch the list of champions once the component initializes
    this.fetchChampions();

    // Listen to changes in the champion input for type-ahead functionality
    this.videoForm.controls.championName?.valueChanges
      .pipe(
        debounceTime(300), // Add a debounce to reduce API calls
        distinctUntilChanged() // Avoid repetitive calls for the same value
      )
      .subscribe((value: string | null) => {
        this.filterChampionList(value);
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

  // Filter lists based on input
  filterChampionList(input: string | null) {
    console.log('filterChampionList', this.filteredChampionsList);
    console.log('filterChampionList', input);
    if (!input) {
      this.filteredChampionsList = this.championsList; // Reset to all champions if input is empty
    } else {
      this.filteredChampionsList = this.championsList.filter(champion =>
        champion.toLowerCase().includes(input.toLowerCase())
      );
    }
    console.log('filterChampionList', this.filteredChampionsList);
  }

  // Submit the form
  submitForm(): void {
    if (this.videoForm.valid) {
      const {youtubeUrl, championName} = this.videoForm.value;
      console.log('Submitting:', {youtubeUrl, championName});

      // Here, you can make an API call to save the video and its metadata
      // Example:
      // this.videoService.addVideo({ youtubeUrl, championName });

      alert('Video data submitted successfully!');
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
