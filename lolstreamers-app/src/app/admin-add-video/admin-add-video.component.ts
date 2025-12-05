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
import {TypeAheadInputComponent} from "../shared/type-ahead-input/type-ahead-input.component";
import {SeasonInputComponent} from "../shared/season-input/season-input.component"; // <== import


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
        StreamerInputComponent,
        SeasonInputComponent
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

  /**
   * Generic helper to apply a single selection to a TypeAheadInputComponent,
   * with validation against its itemsSuggestionList.
   */
  private _applySingleSelectionToInput(
    inputComponent: TypeAheadInputComponent | undefined,
    value: string | undefined | null,
    context: string,
    updateSelectedArray: (val: string[]) => void
  ): void {
    if (!inputComponent || !value) {
      return;
    }

    // Ensure suggestions are initialized
    inputComponent.initializeItemsList();

    const suggestionList = inputComponent.itemsSuggestionList ?? [];
    if (!suggestionList.includes(value)) {
      console.error(
        `${context}: value "${value}" is not present in itemsSuggestionList.`,
        { value, suggestionList }
      );
      return;
    }

    // Clear any existing selection
    inputComponent.selectedItems = [];

    // Update parent/base selection array
    updateSelectedArray([value]);

    // Select in the UI and emit
    inputComponent.selectItem(value);
    inputComponent.emitEvent();
  }

  /**
   * Generic helper to apply multiple selections to a TypeAheadInputComponent,
   * with validation against its itemsSuggestionList.
   */
  private _applyMultipleSelectionsToInput(
    inputComponent: TypeAheadInputComponent | undefined,
    values: string[] | undefined | null,
    context: string,
    updateSelectedArray: (val: string[]) => void
  ): void {
    if (!inputComponent || !values || values.length === 0) {
      return;
    }

    inputComponent.initializeItemsList();
    const suggestionList = inputComponent.itemsSuggestionList ?? [];

    const validValues: string[] = [];
    const invalidValues: string[] = [];

    for (const value of values) {
      if (suggestionList.includes(value)) {
        validValues.push(value);
      } else {
        invalidValues.push(value);
      }
    }

    if (inputComponent != this.itemsInput && invalidValues.length > 0) {
      console.error(
        `${context}: some values are not present in itemsSuggestionList.`,
        { invalidValues, suggestionList }
      );
    }

    if (validValues.length === 0) {
      return;
    }

    // Clear any existing selection
    inputComponent.selectedItems = [];

    // Update base selection
    updateSelectedArray(validValues);

    // Select all valid values in the UI
    for (const value of validValues) {
      inputComponent.selectItem(value);
      // selectItem already updates selectedItems & emits, but we keep
      // updateSelectedArray in sync via the final array above.
    }

    inputComponent.emitEvent();
  }

  _updateChampion() {
    const championName = this.leagueMatchSummary?.championName;
    this._applySingleSelectionToInput(
      this.championInput,
      championName,
      'LeagueMatchSummary championName',
      (val) => this.selectedChampion = val
    );
  }

  _updateLane() {
    const lane = this.leagueMatchSummary?.individualPosition;
    this._applySingleSelectionToInput(
      this.laneInput,
      lane,
      'LeagueMatchSummary individualPosition',
      (val) => this.selectedLane = val
    );
  }

  _updateEnemyChampion() {
    const opponentList = this.leagueMatchSummary?.participants?.opponent;
    const enemyChampionName = opponentList && opponentList.length > 0
      ? opponentList[0].championName
      : undefined;

    this._applySingleSelectionToInput(
      this.enemyChampionInput,
      enemyChampionName,
      'LeagueMatchSummary opponent[0].championName',
      (val) => this.selectedEnemyChampion = val
    );
  }

  _updateRunes() {
    const primary = this.leagueMatchSummary?.primary_runes ?? [];
    const secondary = this.leagueMatchSummary?.secondary_runes ?? [];
    const allRunes = [...primary, ...secondary];

    this._applyMultipleSelectionsToInput(
      this.runesInput,
      allRunes,
      'LeagueMatchSummary primary_runes/secondary_runes',
      (val) => this.selectedRunes = val
    );
  }

  _updateTeamChampions() {
    const teamMembers = this.leagueMatchSummary?.participants?.teamMembers ?? [];
    if (teamMembers.length === 0) {
      return;
    }

    // Take up to 4 champions from indices 0..3
    const teamChampionNames = teamMembers
      .slice(0, 4)
      .map(m => m.championName)
      .filter(name => !!name);

    this._applyMultipleSelectionsToInput(
      this.teamChampionsInput,
      teamChampionNames,
      'LeagueMatchSummary teamMembers[0..3].championName',
      (val) => this.selectedTeamChampions = val
    );
  }

  _updateEnemyTeamChampions() {
    const teamMembers = this.leagueMatchSummary?.participants?.enemyTeamMembers ?? [];
    if (teamMembers.length === 0) {
      return;
    }

    // Take up to 4 champions from indices 0..3
    const teamChampionNames = teamMembers
      .slice(0, 4)
      .map(m => m.championName)
      .filter(name => !!name);

    this._applyMultipleSelectionsToInput(
      this.enemyTeamChampionsInput,
      teamChampionNames,
      'LeagueMatchSummary enemyTeamMembers[0..3].championName',
      (val) => this.selectedEnemyTeamChampions = val
    );
  }

  _updateItems() {
    if (!this.leagueMatchSummary) {
      return;
    }

    const {
      item0,
      item1,
      item2,
      item3,
      item4,
      item5
    } = this.leagueMatchSummary;

    const items = [item0, item1, item2, item3, item4, item5]
      .filter((i): i is string => !!i);

    this._applyMultipleSelectionsToInput(
      this.itemsInput,
      items,
      'LeagueMatchSummary item0..item5',
      (val) => this.selectedItems = val
    );
  }

  /**
   * Called when the user clicks "Accept" in the league match popup.
   */
  onAcceptLeagueMatch(): void {
    this._updateChampion();
    this._updateLane();
    this._updateEnemyChampion();
    this._updateRunes();
    this._updateTeamChampions();
    this._updateEnemyTeamChampions();
    this._updateItems();
    this.showLeagueMatchPopup = false;
  }
}
