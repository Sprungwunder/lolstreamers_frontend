import {Component, inject, SecurityContext} from '@angular/core';
import {VideoBaseComponent} from '../video-base/video-base.component';
import {VideoService} from '../../video.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {LeagueMatchSummary} from "../../video";

@Component({
  template: '',
  standalone: false
})
export abstract class AdminBaseComponent extends VideoBaseComponent {
  protected router = inject(Router);
  protected sanitizer = inject(DomSanitizer);
  buttonText = 'Submit';

  // Popup state for league match summary
  showLeagueMatchPopup = false;
  leagueMatchSummary: LeagueMatchSummary | null = null;

  constructor(
    protected override videoService: VideoService
  ) {
    super(videoService);
    this.isAdmin = true;
  }

  // Common functionality for validating form data
  protected isValidateFormData(): boolean {
    if (this.selectedChampion.length > 1 ||
      this.selectedEnemyChampion.length > 1 ||
      this.selectedLane.length > 1 ||
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
      ...this.selectedLane,
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

  // Sanitize input strings
  protected sanitizeInput(input: string): string {
    // Remove potentially dangerous characters
    return input.replace(/[<>"]/g, '');
  }

  // Common functionality for submitting video data to API
  protected submitVideoToApi(youtubeUrl: string): void {
    if (this.inputForm.valid && this.isValidateFormData()) {
      // Store current selections for "add another" functionality
      const championForNext = [...this.selectedChampion];
      const runesForNext = [...this.selectedRunes];
      const laneForNext = [...this.selectedLane];
      const shouldAddAnother = this.addAnotherVideo;

      // Sanitize all inputs
      const selectedChampions = this.sanitizeInput(this.selectedChampion.join(',') || '');
      const selectedEnemyChampion = this.sanitizeInput(this.selectedEnemyChampion.join(',') || '');
      const selectedLane = this.sanitizeInput(this.selectedLane.join(',') || '');
      const selectedRunes = this.selectedRunes.map(c => this.sanitizeInput(c));
      const selectedItems = this.selectedItems.map(c => this.sanitizeInput(c));
      const selectedTeamChampions = this.selectedTeamChampions.map(c => this.sanitizeInput(c));
      const selectedEnemyTeamChampions = this.selectedEnemyTeamChampions.map(c => this.sanitizeInput(c));
      const sanitizedUrl = this.sanitizeInput(youtubeUrl || '');

      this.videoService.addVideo({
        youtubeUrl: sanitizedUrl,
        selectedChampions: selectedChampions,
        selectedEnemyChampion: selectedEnemyChampion,
        lane: selectedLane,
        selectedRunes: selectedRunes,
        selectedItems: selectedItems,
        selectedTeamChampions: selectedTeamChampions,
        selectedEnemyTeamChampions: selectedEnemyTeamChampions
      }).then(response => {
        if (response.success) {
          alert(response.message);
          if (shouldAddAnother) {
            // Navigate to add video with prefilled data
            this.router.navigate(['/adm/add'], {
              queryParams: {
                champion: championForNext.join(','),
                runes: runesForNext.join(','),
                lane: laneForNext.join(',')
              }
            });
          } else {
            this.router.navigate(['/adm']);
          }
        } else {
          alert(response.message);
        }
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }

  override onYoutubeUrlChange(event: any) {
    const url = event.target.value;
    if (url && this.inputForm.get('youtubeUrl')?.valid) {
      this.checkForDuplicates(url);
    } else {
      this.showDuplicateWarning = false;
      this.duplicateVideos = [];
    }
  }

  // Check for duplicate videos when YouTube URL changes
  async checkForDuplicates(youtubeUrl: string): Promise<void> {
    if (!youtubeUrl || this.inputForm.get('youtubeUrl')?.invalid) {
      this.showDuplicateWarning = false;
      this.duplicateVideos = [];
      return;
    }

    try {
      const result = await this.videoService.checkDuplicateVideo(youtubeUrl);
      this.duplicateVideos = result.videos;
      this.showDuplicateWarning = result.hasDuplicates;
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      this.showDuplicateWarning = false;
      this.duplicateVideos = [];
    }
  }

  /*
    response from api:
    {
      "riotIdGameName": "Chamkin",
      "riotIdTagline": "EUW",
      "championName": "Nocturne",
      "lane": "JUNGLE",
      "individualPosition": "JUNGLE",
      "item0": "Experimental Hexplate",
      "item1": "Stridebreaker",
      "item2": "Armored Advance",
      "item3": "Sterak's Gage",
      "item4": "Caulfield's Warhammer",
      "item5": null,
      "primary_runes": [
        "Conqueror",
        "Triumph",
        "Legend: Alacrity",
        "Last Stand"
      ],
      "secondary_runes": [
        "Grisly Mementos",
        "Ultimate Hunter"
      ],
      "participants": {
        "teamMembers": [
          {
            "championName": "Darius",
            "lane": "TOP",
            "individualPosition": "TOP",
            "teamId": 100
          },
          {
            "championName": "Malzahar",
            "lane": "MIDDLE",
            "individualPosition": "MIDDLE",
            "teamId": 100
          },
          {
            "championName": "Taric",
            "lane": "BOTTOM",
            "individualPosition": "BOTTOM",
            "teamId": 100
          },
          {
            "championName": "Braum",
            "lane": "BOTTOM",
            "individualPosition": "UTILITY",
            "teamId": 100
          }
        ],
        "enemyTeamMembers": [
          {
            "championName": "Zaahen",
            "lane": "JUNGLE",
            "individualPosition": "TOP",
            "teamId": 200
          },
          {
            "championName": "Veigar",
            "lane": "MIDDLE",
            "individualPosition": "MIDDLE",
            "teamId": 200
          },
          {
            "championName": "Kaisa",
            "lane": "BOTTOM",
            "individualPosition": "BOTTOM",
            "teamId": 200
          },
          {
            "championName": "Bard",
            "lane": "BOTTOM",
            "individualPosition": "UTILITY",
            "teamId": 200
          }
        ],
        "opponent": [
          {
            "championName": "FiddleSticks",
            "lane": "JUNGLE",
            "individualPosition": "JUNGLE",
            "teamId": 200
          }
        ]
      }
    }


   */
  async getVideoDetails(youtubeUrl: string): Promise<any> {
    if (!youtubeUrl) {
      return null;
    }

    try {
      const details = await this.videoService.getVideoDetails(youtubeUrl);

      if (!details) {
        console.log('No league match details available for this video.');
        this.showLeagueMatchPopup = false;
        this.leagueMatchSummary = null;
        return null;
      }

      console.log('League match details for video:', details);

      // Store the full summary for use in the popup and accept logic
      this.leagueMatchSummary = details as LeagueMatchSummary;
      this.showLeagueMatchPopup = true;

      return details;
    } catch (error) {
      console.error('Error in getVideoDetails:', error);
      this.showLeagueMatchPopup = false;
      this.leagueMatchSummary = null;
      return null;
    }
  }

  // To be implemented by child classes
  abstract override handleSubmit(): void;
}
