import {Component, inject} from '@angular/core';
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
import {Router} from "@angular/router";


@Component({
  selector: 'app-admin-add-video',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChampionNameInputComponent,
    EnemyChampionNameInputComponent,
    EnemyTeamChampionsInputComponent,
    ItemsInputComponent,
    RunesInputComponent,
    TeamChampionsInputComponent,
    VideoCardComponent
  ],
  templateUrl: '../streamer-home/streamer-home.component.html',
  styleUrls: ['./admin-add-video.component.css'],
})
export class AdminAddVideoComponent extends VideoBaseComponent {
  override hasYoutubeUrl = true;
  buttonText = "Submit"
  private router = inject(Router);

  constructor(protected override videoService: VideoService) {
    super(videoService);
  }

  ngOnInit() {
    this.initializeData();
  }

  handleSubmit() {
    this.submitForm();
  }

  isValidateFormData() {
    if (this.selectedChampion.length > 1 ||
      this.selectedEnemyChampion.length > 1 ||
      this.selectedRunes.length > 6 ||
      this.selectedItems.length > 6 ||
      this.selectedTeamChampions.length > 4 ||
      this.selectedEnemyTeamChampions.length > 4) {
      alert('Too many selections in one or more fields');
      return false;
    }
    // Validate each array element for suspicious content
    const allInputs = [
      ...this.selectedChampion,
      ...this.selectedEnemyChampion,
      ...this.selectedRunes,
      ...this.selectedItems,
      ...this.selectedTeamChampions,
      ...this.selectedEnemyTeamChampions
    ];

    // Check for suspicious content like script tags, SQL injection, etc.
    const hasSuspiciousContent = allInputs.some(input =>
      /<script|javascript:|alert\(|SELECT|INSERT|UPDATE|DELETE|DROP|http|xml|;/.test(input)
    );

    if (hasSuspiciousContent) {
      alert('Invalid input detected');
      return false;
    }
    return true;

  }
  // Submit the form
  submitForm(): void {
    if (this.inputForm.valid) {
      if (!this.isValidateFormData()) {
        return;
      }

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
      const selectedChampions = this.selectedChampion.join(',') ?? '';
      const selectedEnemyChampion = this.selectedEnemyChampion.join(',') ?? '';
      const selectedRunes = this.selectedRunes;
      const selectedItems = this.selectedItems;
      const selectedTeamChampions = this.selectedTeamChampions;
      const selectedEnemyTeamChampions = this.selectedEnemyTeamChampions;

      this.videoService.addVideo({
        youtubeUrl,
        selectedChampions,
        selectedEnemyChampion,
        lane,
        selectedRunes,
        selectedItems,
        selectedTeamChampions,
        selectedEnemyTeamChampions
      }).then(response => {
        if (response.success) {
          alert(response.message);
          this.router.navigate(['/admin']);
        } else {
          alert(response.message);
        }
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
