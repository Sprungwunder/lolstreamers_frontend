import {Injectable} from '@angular/core';
import {Video} from "./video";

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  url = 'http://localhost:3000/videos';

  async getAllVideos(): Promise<Video[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

  async getVideoById(id: string): Promise<Video | undefined> {
    const data = await fetch(`${this.url}/${id}`);
    return await data.json() ?? {};
  }

  submitSearch(id: string) {
    console.log(`submitSearch: ${id}`);
  }

  constructor() {

  }
}
