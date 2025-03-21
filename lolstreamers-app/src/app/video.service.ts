import {Injectable} from '@angular/core';
import {Video} from "./video";


@Injectable({
  providedIn: 'root'
})
export class VideoService {
  url = 'http://localhost:8000/streamers';

  async getAllChampions(): Promise<string[]> {
    const data = await fetch(`${this.url}/champions/`);
    return await (await data.json()).champions ?? [];
  };

  async getAllRunes(): Promise<string[]> {
    const data = await fetch(`${this.url}/runes/`);
    return await (await data.json()).runes ?? [];
  };


  async getAllOpponentChampions(): Promise<string[]> {
    const data = await fetch(`${this.url}/opponent-champions/`);
    return await (await data.json()).opponent_champions ?? [];
  };

  async getAllTeamChampions(): Promise<string[]> {
    const data = await fetch(`${this.url}/team-champions/`);
    return await (await data.json()).team_champions ?? [];
  }

  async getAllOpponentTeamChampions(): Promise<string[]> {
    const data = await fetch(`${this.url}/opponent-team-champions/`);
    return await (await data.json()).opponent_team_champions ?? [];
  }

  async getAllVideos(): Promise<Video[]> {
    console.log(`getAllVideos`);
    const data = await fetch(this.url+'/ytvideos/');
    return await data.json() ?? [];
  }

  async getVideoById(id: string): Promise<Video | undefined> {
    console.log(`getVideoById: ${id}`);
    const data = await fetch(`${this.url}/ytvideos/${id}`);
    return await data.json() ?? {};
  }

  // Centralized method to fetch and manage all initialization data
  async fetchInitialData() {
    return Promise.all([
      this.getAllChampions(),
      this.getAllOpponentChampions(),
      this.getAllRunes(),
      this.getAllTeamChampions(),
      this.getAllOpponentTeamChampions(),
      this.getAllVideos(),
    ]);
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
    team_champions: ${teamChampions},
    opponent_team_champions: ${opponentTeamChampions}`);
    const response = await fetch(
      `${this.url}/ytvideos/?champion=${encodeURIComponent(champion)}`+
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
