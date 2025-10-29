import {Component, OnDestroy} from '@angular/core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {VideoCardComponent} from "../video-card/video-card.component";
import {Video} from "../video";
import {VideoBaseComponent} from "../shared/video-base/video-base.component";
import {VideoService} from "../video.service";
import {ChampionNameInputComponent} from "../shared/champion-name-input/champion-name-input.component";
import {EnemyChampionNameInputComponent} from "../shared/enemy-champion-name-input/enemy-champion-name-input.component";
import {RunesInputComponent} from "../shared/runes-input/runes-input.component";
import {ItemsInputComponent} from "../shared/items-input/items-input.component";
import {TeamChampionsInputComponent} from "../shared/team-champions-input/team-champions-input.component";
import {
  EnemyTeamChampionsInputComponent
} from "../shared/enemy-team-champions-input/enemy-team-champions-input.component";
import {LaneInputComponent} from "../shared/lane-input/lane-input.component";
import {StreamerInputComponent} from "../shared/streamer-input/streamer-input.component";
import {CookieConsentService} from '../shared/cookie-consent/cookie-consent.service';
import {Subscription} from 'rxjs';
import {ChampionService} from "../shared/champion-service/champion-service.service";

@Component({
  selector: 'app-streamer-home',
  imports: [
    FormsModule,
    VideoCardComponent,
    ReactiveFormsModule,
    ChampionNameInputComponent,
    EnemyChampionNameInputComponent,
    RunesInputComponent,
    ItemsInputComponent,
    TeamChampionsInputComponent,
    EnemyTeamChampionsInputComponent,
    LaneInputComponent,
    StreamerInputComponent
  ],
  templateUrl: './streamer-home.component.html',
  styleUrl: './streamer-home.component.css'
})
export class StreamerHomeComponent extends VideoBaseComponent implements OnDestroy {

  buttonText = "Search"
  isSearching = false;
  showMoreFilters = false; // Add this property
  hasConsent = false;
  private consentSubscription: Subscription;

  constructor(
    protected override videoService: VideoService,
    private cookieConsentService: CookieConsentService,
    private sharedChampionService: ChampionService
  ) {
    super(videoService);
    this.consentSubscription = this.cookieConsentService.consent$.subscribe(
      (hasConsent) => {
        this.hasConsent = hasConsent;
        if (hasConsent && this.videoList.length === 0) {
          this.initializeData();
        }
      }
    );
  }

  ngOnInit() {
    this.hasConsent = this.cookieConsentService.hasConsent();
    if (this.hasConsent) {
      this.initializeData();
    }
    // Reset champion selections when component initializes
    this.sharedChampionService.resetSelections();
  }

  ngOnDestroy() {
    if (this.consentSubscription) {
      this.consentSubscription.unsubscribe();
    }
    // Reset champion selections when component is destroyed
    this.sharedChampionService.resetSelections();
  }

  async initializeData() {
    if (!this.hasConsent) {
      return;
    }

    this.videoService.getAllStreamers().then((streamer: string[]) => {
      this.streamerList = streamer;
      this.selectedStreamer = streamer; // Initially, all streamers are in the filtered list
    });
    const videoList = await this.videoService.getAllVideos();
    this.videoList = videoList;
    this.filteredVideoList = [...videoList];
  }

  // Filter videos based on the selected champion and other filters
  filterVideos() {
    if (!this.hasConsent) {
      return;
    }

    this.isSearching = true;
    this.videoService.filterVideos(
      this.selectedChampion.join(',') ?? '',
      this.selectedLane.join(',') ?? '',
      this.selectedEnemyChampion.join(',') ?? '',
      this.selectedRunes.join(',') ?? '',
      this.selectedItems.join(',') ?? '',
      this.selectedTeamChampions.join(',') ?? '',
      this.selectedEnemyTeamChampions.join(',') ?? '',
      this.selectedStreamer.join(',') ?? '',
    ).then((videos: Video[]) => {
      this.filteredVideoList = videos;
      this.isSearching = false;
      this.buttonText = "Search";
    }).catch((error) => {
      console.error('Failed to filter videos:', error);
      this.isSearching = false;
      this.buttonText = "Search";
      alert('Failed to filter videos. Please try again later.');
    });
  }

  handleSubmit() {
    if (this.isSearching || !this.hasConsent) {
      return; // Do nothing if the search is already in progress or no consent
    }
    this.filterVideos();
  }

  override onVideoDeleted(_videoId: string) {
    if (this.hasConsent) {
      this.filterVideos();
    }
  }

  override onVideoActivated(_videoId: string) {
    if (this.hasConsent) {
      this.filterVideos();
    }
  }

  toggleMoreFilters() {
    this.showMoreFilters = !this.showMoreFilters;
  }
}

