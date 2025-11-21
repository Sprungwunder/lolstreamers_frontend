import {Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {ActivatedRoute} from "@angular/router";
import {VideoService} from "../video.service";


@Component({
    selector: 'app-admin-add-video',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
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
  showMoreFilters = true;

  @ViewChild('championInput') championInput!: ChampionNameInputComponent;
  @ViewChild('laneInput') laneInput!: LaneInputComponent;
  @ViewChild('runesInput') runesInput!: RunesInputComponent;
  @ViewChild('enemyChampionInput') enemyChampionInput!: EnemyChampionNameInputComponent;
  @ViewChild('itemsInput') itemsInput!: ItemsInputComponent;
  @ViewChild('teamChampionsInput') teamChampionsInput!: TeamChampionsInputComponent;
  @ViewChild('enemyTeamChampionsInput') enemyTeamChampionsInput!: EnemyTeamChampionsInputComponent;


  constructor(
    private route: ActivatedRoute,
    protected override videoService: VideoService
  ) {
    super(videoService);
  }
  ngAfterViewInit() {
    // Additional initialization after view is ready
    setTimeout(() => {
      this.initializeInputsWithQueryParams();
    }, 500);
  }

  async ngOnInit() {
    // Check for prefilled data from query parameters
    this.route.queryParams.subscribe(params => {
      this.resetFormValue();
      this.setFromQueryParams(params);
      // Initialize inputs after data is set
      setTimeout(() => {
        this.initializeInputsWithQueryParams();
      }, 100);
    });

    // Initialize form value change subscription for YouTube URL
    this.inputForm.get('youtubeUrl')?.valueChanges.subscribe(value => {
      if (value && this.inputForm.get('youtubeUrl')?.valid) {
        // Debounce the duplicate check to avoid too many API calls
        setTimeout(() => {
          this.checkForDuplicates(value);
          this.getVideoDetails(value);
        }, 500);
      } else {
        this.showDuplicateWarning = false;
        this.duplicateVideos = [];
      }
    });
  }

  private resetFormValue() {
    // Clear all selections except the ones that will be prefilled
    this.selectedEnemyChampion = [];
    this.selectedItems = [];
    this.selectedTeamChampions = [];
    this.selectedEnemyTeamChampions = [];

    // Clear input components if they exist
    setTimeout(() => {
      this.clearInputComponents();
    }, 50);

    // Clear the form and reset YouTube URL
    this.inputForm.patchValue({
      youtubeUrl: ''
    });
    // Reset duplicate warning
    this.showDuplicateWarning = false;
    this.duplicateVideos = [];
  }

  private setFromQueryParams(params: any) {
    if (params['champion']) {
      this.selectedChampion = params['champion'].split(',');
    }
    if (params['runes']) {
      this.selectedRunes = params['runes'].split(',');
    }
    if (params['lane']) {
      this.selectedLane = params['lane'].split(',');
    }
  }

  private clearInputComponents() {
    if (this.enemyChampionInput) {
      this.enemyChampionInput.selectedItems = [];
      this.enemyChampionInput.initializeItemsList();
    }
    if (this.itemsInput) {
      this.itemsInput.selectedItems = [];
      this.itemsInput.initializeItemsList();
    }
    if (this.teamChampionsInput) {
      this.teamChampionsInput.selectedItems = [];
      this.teamChampionsInput.initializeItemsList();
    }
    if (this.enemyTeamChampionsInput) {
      this.enemyTeamChampionsInput.selectedItems = [];
      this.enemyTeamChampionsInput.initializeItemsList();
    }
  }

  private initializeInputsWithQueryParams() {
    if (this.championInput && this.selectedChampion.length > 0) {
      this.championInput.selectedItems = [...this.selectedChampion];
      this.championInput.initializeItemsList();
      for (const champion of this.selectedChampion) {
        this.championInput.selectItem(champion);
      }
    }

    if (this.laneInput && this.selectedLane.length > 0) {
      this.laneInput.selectedItems = [...this.selectedLane];
      this.laneInput.initializeItemsList();
      for (const lane of this.selectedLane) {
        this.laneInput.selectItem(lane);
      }
    }

    if (this.runesInput && this.selectedRunes.length > 0) {
      this.runesInput.selectedItems = [...this.selectedRunes];
      this.runesInput.initializeItemsList();
      for (const rune of this.selectedRunes) {
        this.runesInput.selectItem(rune);
      }
    }
  }

  handleSubmit() {
    const {youtubeUrl} = this.inputForm.value;
    this.submitVideoToApi(youtubeUrl || '');
  }

  toggleMoreFilters() {}
}
