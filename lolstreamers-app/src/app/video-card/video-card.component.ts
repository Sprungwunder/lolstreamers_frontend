import { Component, Input } from '@angular/core';
import {Video} from "../video";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.css'
})
export class VideoCardComponent {
 @Input() video!: Video;
}
