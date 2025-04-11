import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {VideoService} from '../video.service';
import {VideoBaseComponent} from "../shared/video-base/video-base.component";
import {ChampionNameInputComponent} from "../shared/champion-name-input/champion-name-input.component";
import {EnemyChampionNameInputComponent} from "../shared/enemy-champion-name-input/enemy-champion-name-input.component";
import {
  EnemyTeamChampionsInputComponent
} from "../shared/enemy-team-champions-input/enemy-team-champions-input.component";
import {ItemsInputComponent} from "../shared/items-input/items-input.component";
import {RunesInputComponent} from "../shared/runes-input/runes-input.component";
import {TeamChampionsInputComponent} from "../shared/team-champions-input/team-champions-input.component";
import {VideoCardComponent} from "../video-card/video-card.component";


@Component({
  selector: 'app-admin-add-video',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ChampionNameInputComponent, EnemyChampionNameInputComponent, EnemyTeamChampionsInputComponent, ItemsInputComponent, RunesInputComponent, TeamChampionsInputComponent, VideoCardComponent],
  templateUrl: '../streamer-home/streamer-home.component.html',
  styleUrls: ['./admin-add-video.component.css'],
})
export class AdminAddVideoComponent extends VideoBaseComponent {
  override hasYoutubeUrl = true;
  buttonText = "Submit"

  constructor(protected override videoService: VideoService) {
    super(videoService);
  }

  ngOnInit() {
    this.initializeData();
  }

  handleSubmit() {
    this.submitForm();
  }

  // Submit the form
  submitForm(): void {
    if (this.inputForm.valid) {
      const {youtubeUrl, lane} = this.inputForm.value;
      console.log('Submitting:', youtubeUrl);
      console.log('Manager data:',
        this.selectedChampion.join(',') ?? '',
        lane ?? '',
        this.selectedEnemyChampion.join(',') ?? '',
        this.selectedRunes.join(',') ?? '',
        this.selectedItems.join(',') ?? '',
        this.selectedTeamChampions.join(',') ?? '',
        this.selectedEnemyTeamChampions.join(',') ?? '',
      );

      // Here, you can make an API call to save the video and its metadata
      // Example:
      // this.videoService.addVideo({ youtubeUrl, championName });

      alert('Video data submitted successfully!');
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
