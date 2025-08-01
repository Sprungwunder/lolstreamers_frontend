import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {VideoService} from "../video.service";
import {Video} from "../video";
import {VideoCardComponent} from "../video-card/video-card.component";
import {CommonModule} from "@angular/common";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {ChampionNameInputComponent} from "../shared/champion-name-input/champion-name-input.component";
import {EnemyChampionNameInputComponent} from "../shared/enemy-champion-name-input/enemy-champion-name-input.component";
import {VideoBaseComponent} from "../shared/video-base/video-base.component";
import {
  EnemyTeamChampionsInputComponent
} from "../shared/enemy-team-champions-input/enemy-team-champions-input.component";
import {ItemsInputComponent} from "../shared/items-input/items-input.component";
import {RunesInputComponent} from "../shared/runes-input/runes-input.component";
import {TeamChampionsInputComponent} from "../shared/team-champions-input/team-champions-input.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LaneInputComponent} from "../shared/lane-input/lane-input.component";


@Component({
  selector: 'app-admin-edit-video',
  standalone: true,
  imports: [
    VideoCardComponent,
    CommonModule,
    ChampionNameInputComponent,
    EnemyChampionNameInputComponent,
    EnemyTeamChampionsInputComponent,
    ItemsInputComponent,
    RunesInputComponent,
    TeamChampionsInputComponent,
    FormsModule,
    ReactiveFormsModule,
    LaneInputComponent
  ],
  templateUrl: './admin-edit-video.component.html',
  styleUrl: './admin-edit-video.component.css'
})
export class AdminEditVideoComponent extends VideoBaseComponent implements OnInit {
  private router = inject(Router);
  video: Video | undefined;
  safeSrc: SafeResourceUrl | undefined;

  @ViewChild('championInput') championInput!: ChampionNameInputComponent;
  @ViewChild('enemyChampionInput') enemyChampionInput!: EnemyChampionNameInputComponent;
  @ViewChild('laneInput') laneInput!: LaneInputComponent;
  @ViewChild('runesInput') runesInput!: RunesInputComponent;
  @ViewChild('itemsInput') itemsInput!: ItemsInputComponent;
  @ViewChild('teamChampionsInput') teamChampionsInput!: TeamChampionsInputComponent;
  @ViewChild('enemyTeamChampionsInput') enemyTeamChampionsInput!: EnemyTeamChampionsInputComponent;


  constructor(
    protected override videoService: VideoService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    super(videoService);
    this.isAdmin = true;
  }

  ngOnInit(): void {
    this.loadVideo();
    // Subscribe to lane changes
    this.inputForm.get('lane')?.valueChanges.subscribe(value => {
      if (this.video && value) {
        this.video.lane = value;
      }
    });
  }

  loadVideo(): void {
    const videoId = this.route.snapshot.paramMap.get('id');
    if (videoId) {
      this.videoService.getVideoById(videoId).then(video => {
        this.video = video;
        if (this.video) {
          if (this.video.champion) {
            this.selectedChampion = this.video.champion.split(',');
          }
          if (this.video.enemy_champion) {
            this.selectedEnemyChampion = this.video.enemy_champion.split(',');
          }
          if (this.video.lane) {
            this.selectedLane = this.video.lane.split(',');
          }
          if (this.video.runes) {
            this.selectedRunes = this.video.runes;
          }
          if (this.video.champion_items) {
            this.selectedItems = this.video.champion_items;
          }
          if (this.video.team_champions) {
            this.selectedTeamChampions = this.video.team_champions;
          }
          if (this.video.enemy_team_champions) {
            this.selectedEnemyTeamChampions = this.video.enemy_team_champions;
          }
          this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
            "https://www.youtube.com/embed/" + this.video.ytid + "?start=" + this.video.timestamp
          );
        }
      });
    }
  }

  activateVideo(): void {
    if (!this.video || !this.video.id) {
      console.error('Video data is missing or invalid.');
      return;
    }

    this.videoService.activateVideoById(this.video.id)
      .then((result) => {
        if (result.success) {
          console.log('Video activation request sent successfully!');
          alert('Video activated successfully!');
          this.router.navigate(['/adm']);
        } else {
          console.error('Error activating video:', result.message);
          if (result.message.includes('Authentication required')) {
            // If it's an authentication error, redirect to login
            alert('Your session has expired. Please log in again.');
            this.router.navigate(['/login']);
          } else {
            alert(`Failed to activate video: ${result.message}`);
          }
        }
      })
      .catch((error) => {
        console.error('Unexpected error activating video:', error);
        alert('An unexpected error occurred. Please try again later.');
      });
  }

  override handleSubmit(): void {
    // Implementation of the abstract method
    this.activateVideo();
  }


  ngAfterViewInit() {
    // We need to wait for both the view to be initialized and the video data to be loaded
    setTimeout(() => {
      this.initializeInputs();
    }, 500);
  }

  initializeInputs() {
    if (this.championInput && this.video && this.video.champion) {
      // Set the selected items directly on the component
      this.championInput.selectedItems = this.video.champion.split(',');
      // Call the component's method to update suggestions based on the current selection
      this.championInput.initializeItemsList();
      this.championInput.selectItem(this.video.champion);
    }
    if (this.enemyChampionInput && this.video && this.video.enemy_champion) {
      // Set the selected items directly on the component
      this.enemyChampionInput.selectedItems = this.video.enemy_champion.split(',');
      // Call the component's method to update suggestions based on the current selection
      this.enemyChampionInput.initializeItemsList();
      this.enemyChampionInput.selectItem(this.video.enemy_champion);
    }
    if (this.laneInput && this.video && this.video.lane) {
      this.laneInput.selectedItems = this.video.lane.split(',');
      this.laneInput.initializeItemsList();
      this.laneInput.selectItem(this.video.lane);
    }
    if (this.runesInput && this.video && this.video.runes) {
      this.runesInput.selectedItems = this.video.runes;
      this.runesInput.initializeItemsList();
      for (const rune of this.video.runes) {
        this.runesInput.selectItem(rune);
      }
    }
    if (this.itemsInput && this.video && this.video.champion_items) {
      this.itemsInput.selectedItems = this.video.champion_items;
      this.itemsInput.initializeItemsList();
      for (const item of this.video.champion_items) {
        this.itemsInput.selectItem(item);
      }
    }
    if (this.teamChampionsInput && this.video && this.video.team_champions) {
      this.teamChampionsInput.selectedItems = this.video.team_champions;
      this.teamChampionsInput.initializeItemsList();
      for (const teamChampion of this.video.team_champions) {
        this.teamChampionsInput.selectItem(teamChampion);
      }
    }
    if (this.enemyTeamChampionsInput && this.video && this.video.enemy_team_champions) {
      this.enemyTeamChampionsInput.selectedItems = this.video.enemy_team_champions;
      this.enemyTeamChampionsInput.initializeItemsList();
      for (const enemyTeamChampion of this.video.enemy_team_champions) {
        this.enemyTeamChampionsInput.selectItem(enemyTeamChampion);
      }
    }
  }

  override handleChampionChange(selectedChampions: string[]) {
    super.handleChampionChange(selectedChampions);
    if (this.video) {
      this.video.champion = selectedChampions.join(',');
    }
  }

  override handleEnemyChampionChange(selectedChampions: string[]) {
    super.handleEnemyChampionChange(selectedChampions);
    if (this.video) {
      this.video.enemy_champion = selectedChampions.join(',');
    }
  }

  override handleLanesChange(selectedLane: string[]) {
    super.handleLanesChange(selectedLane);
    if (this.video) {
      this.video.lane = selectedLane.join(',');
    }
  }

  override handleRunesChange(selectedRunes: string[]) {
    super.handleRunesChange(selectedRunes);
    if (this.video) {
      this.video.runes = [...selectedRunes]
      ;
    }
  }

  override handleItemsChange(selectedItems: string[]) {
    super.handleItemsChange(selectedItems);
    if (this.video) {
      this.video.champion_items = [...selectedItems];
    }
  }

  override handleTeamChampionsChange(selectedTeamChampions: string[]) {
    super.handleTeamChampionsChange(selectedTeamChampions);
    if (this.video) {
      this.video.team_champions = [...selectedTeamChampions];
    }
  }

  override handleEnemyTeamChampionsChange(selectedTeamChampions: string[]) {
    super.handleEnemyTeamChampionsChange(selectedTeamChampions);
    if (this.video) {
      this.video.enemy_team_champions = [...selectedTeamChampions];
    }
  }

}
