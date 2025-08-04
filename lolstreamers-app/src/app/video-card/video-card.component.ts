import { Component, Input } from '@angular/core';
import {Video} from "../video";
import {CommonModule} from "@angular/common";
import {AuthService} from "../auth.service";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.css'
})
export class VideoCardComponent {
 @Input() video!: Video;

  constructor(public authService: AuthService) {
  }
}
