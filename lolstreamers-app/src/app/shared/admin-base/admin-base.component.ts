import { Component, inject, SecurityContext } from '@angular/core';
import { VideoBaseComponent } from '../video-base/video-base.component';
import { VideoService } from '../../video.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
    template: '',
    standalone: false
})
export abstract class AdminBaseComponent extends VideoBaseComponent {
  protected router = inject(Router);
  protected sanitizer = inject(DomSanitizer);
  buttonText = 'Submit';

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
          this.router.navigate(['/adm']);
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

  // To be implemented by child classes
  abstract override handleSubmit(): void;
}
