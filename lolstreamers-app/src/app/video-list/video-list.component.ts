import { Component, Input } from '@angular/core';
import {Video} from "../video";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.css'
})
export class VideoListComponent {
 @Input() video!: Video;
}
