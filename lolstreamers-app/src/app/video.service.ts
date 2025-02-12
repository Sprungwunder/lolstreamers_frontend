import {Injectable} from '@angular/core';
import {Video} from "./video";


@Injectable({
  providedIn: 'root'
})
export class VideoService {
  url = 'http://localhost:8000/streamers/ytvideos';


  async getAllVideos(): Promise<Video[]> {
    console.log(`getAllVideos`);
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

  async getVideoById(id: string): Promise<Video | undefined> {
    console.log(`getVideoById: ${id}`);
    const data = await fetch(`${this.url}/${id}`);
    return await data.json() ?? {};
  }

  submitSearch(id: string) {
    console.log(`submitSearch: ${id}`);
  }

  async filterVideos(
    champion: string,
    lane: string,
    opponent_champion: string,
    runes: string,
    teamChampions: string,
    opponentTeamChampions: string,
    championItems: string
  ): Promise<Video[]> {
    console.log(`filterVideos called with -
    champion: ${champion},
    lane: ${lane},
    opponent_champion: ${opponent_champion},
    runes: ${runes},
    team_champions: ${teamChampions}`);
    const response = await fetch(
      `${this.url}/?champion=${encodeURIComponent(champion)}`+
      `&lane=${encodeURIComponent(lane)}`+
      `&opponent_champion=${encodeURIComponent(opponent_champion)}`+
      `&runes=${encodeURIComponent(runes)}`+
      `&team_champions=${encodeURIComponent(teamChampions)}` +
      `&opponent_team_champions=${encodeURIComponent(opponentTeamChampions)}` +
      `&champion_items=${encodeURIComponent(championItems)}`
    );
    return await response.json() ?? [];
  }

  constructor() {

  }
}
