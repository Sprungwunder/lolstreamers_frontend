import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ChampionNameInputComponent} from "../shared/champion-name-input/champion-name-input.component";
import {EnemyChampionNameInputComponent} from "../shared/enemy-champion-name-input/enemy-champion-name-input.component";
import {
  EnemyTeamChampionsInputComponent
} from "../shared/enemy-team-champions-input/enemy-team-champions-input.component";
import {ItemsInputComponent} from "../shared/items-input/items-input.component";
import {RunesInputComponent} from "../shared/runes-input/runes-input.component";
import {TeamChampionsInputComponent} from "../shared/team-champions-input/team-champions-input.component";
import {VideoCardComponent} from "../video-card/video-card.component";
import {LaneInputComponent} from "../shared/lane-input/lane-input.component";
import {AdminBaseComponent} from "../shared/admin-base/admin-base.component";
import {StreamerInputComponent} from "../shared/streamer-input/streamer-input.component";


@Component({
    selector: 'app-admin-add-video',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ChampionNameInputComponent,
        EnemyChampionNameInputComponent,
        LaneInputComponent,
        EnemyTeamChampionsInputComponent,
        ItemsInputComponent,
        RunesInputComponent,
        TeamChampionsInputComponent,
        VideoCardComponent,
        StreamerInputComponent
    ],
    templateUrl: '../streamer-home/streamer-home.component.html',
    styleUrls: ['./admin-add-video.component.css']
})
export class AdminAddVideoComponent extends AdminBaseComponent implements OnInit {
  isSearching = false;
  hasConsent = true;

  ngOnInit() {
    // Initialize form value change subscription for YouTube URL
    this.inputForm.get('youtubeUrl')?.valueChanges.subscribe(value => {
      if (value && this.inputForm.get('youtubeUrl')?.valid) {
        // Debounce the duplicate check to avoid too many API calls
        setTimeout(() => {
          this.checkForDuplicates(value);
        }, 500);
      } else {
        this.showDuplicateWarning = false;
        this.duplicateVideos = [];
      }
    });
  }

  handleSubmit() {
    const {youtubeUrl} = this.inputForm.value;
    this.submitVideoToApi(youtubeUrl || '');
  }
}
