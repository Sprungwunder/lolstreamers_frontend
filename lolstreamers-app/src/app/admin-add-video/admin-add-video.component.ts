import {Component, inject, SecurityContext} from '@angular/core';
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
import {DomSanitizer} from "@angular/platform-browser";


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
  override isAdmin = true;
  buttonText = "Submit"
  private router = inject(Router);

  constructor(protected override videoService: VideoService, private sanitizer: DomSanitizer
  ) {
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

    // Check that each input remains unchanged after sanitization
    for (const input of allInputs) {
      const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, input);
      if (sanitized !== input) {
        alert('Invalid input detected');
        return false;
      }

      // Additional validation for strictly alphanumeric content with specific allowed characters
      if (!/^[a-zA-Z0-9\s\-_.,:']+$/.test(input)) {
        alert('Input contains invalid characters');
        return false;
      }
    }

    return true;

  }

  private sanitizeInput(input: string): string {
    // Remove potentially dangerous characters
    return input.replace(/[<>"]/g, '');
  }


  // Submit the form
  submitForm(): void {
    if (this.inputForm.valid && this.isValidateFormData()) {
      const {youtubeUrl, lane} = this.inputForm.value;

      /*
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
      */

      // Sanitize all inputs
      const selectedChampions = this.sanitizeInput(this.selectedChampion.join(',') || '');
      const selectedEnemyChampion = this.sanitizeInput(this.selectedEnemyChampion.join(',') || '');
      const selectedRunes = this.selectedRunes.map(c => this.sanitizeInput(c));
      const selectedItems = this.selectedItems.map(c => this.sanitizeInput(c));
      const selectedTeamChampions = this.selectedTeamChampions.map(c => this.sanitizeInput(c));
      const selectedEnemyTeamChampions = this.selectedEnemyTeamChampions.map(c => this.sanitizeInput(c));
      const sanitizedUrl = this.sanitizeInput(youtubeUrl || '');
      const sanitizedLane = this.sanitizeInput(lane || '');

      this.videoService.addVideo({
          youtubeUrl: sanitizedUrl,
          selectedChampions: selectedChampions,
          selectedEnemyChampion: selectedEnemyChampion,
          lane: sanitizedLane,
          selectedRunes: selectedRunes,
          selectedItems: selectedItems,
          selectedTeamChampions: selectedTeamChampions,
          selectedEnemyTeamChampions: selectedEnemyTeamChampions
        }
      ).then(response => {
        if (response.success) {
          alert(response.message);
          this.router.navigate(['/adm']);
        } else {
          alert(response.message);
        }
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
