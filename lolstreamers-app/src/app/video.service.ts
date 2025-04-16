import {Injectable} from '@angular/core';
import {Video} from "./video";


@Injectable({
  providedIn: 'root'
})
export class VideoService {
  url = 'http://localhost:8000/streamers';

  async getAllChampions(): Promise<string[]> {
    const data = await fetch(`${this.url}/champions/`);
    return await (await data.json()).champion ?? [];
  };

  async getAllRunes(): Promise<string[]> {
    const data = await fetch(`${this.url}/runes/`);
    return await (await data.json()).runes ?? [];
  };

  async getAllChampionItems(): Promise<string[]> {
    const data = await fetch(`${this.url}/champion-items/`);
    return await (await data.json()).champion_items ?? [];
  };

  async getAllOpponentChampions(): Promise<string[]> {
    const data = await fetch(`${this.url}/opponent-champions/`);
    return await (await data.json()).opponent_champion ?? [];
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
    const data = await fetch(this.url+'/ytvideos/?is_active=true');
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
      this.getAllChampionItems(),
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
    championItems: string,
    teamChampions: string,
    opponentTeamChampions: string,
  ): Promise<Video[]> {
    let cleanedLane = lane.replace('Any', '');
    console.log(`filterVideos called with -
    champion: ${champion},
    lane: ${cleanedLane},
    opponent_champion: ${opponent_champion},
    items: ${championItems},
    runes: ${runes},
    team_champions: ${teamChampions},
    opponent_team_champions: ${opponentTeamChampions}`);

    const response = await fetch(
      `${this.url}/ytvideos/?is_active=true&`+
      `champion=${encodeURIComponent(champion)}`+
      `&lane=${encodeURIComponent(cleanedLane)}`+
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
