import {Component} from '@angular/core';
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


@Component({
  selector: 'app-admin-add-video',
  standalone: true,
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
    VideoCardComponent
  ],
  templateUrl: '../streamer-home/streamer-home.component.html',
  styleUrls: ['./admin-add-video.component.css'],
})
export class AdminAddVideoComponent extends AdminBaseComponent {

  handleSubmit() {
    const {youtubeUrl} = this.inputForm.value;
    this.submitVideoToApi(youtubeUrl || '');
  }
}
