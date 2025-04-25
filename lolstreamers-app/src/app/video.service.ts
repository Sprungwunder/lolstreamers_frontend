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

  async getAllEnemyChampions(): Promise<string[]> {
    const data = await fetch(`${this.url}/enemy-champions/`);
    return await (await data.json()).enemy_champion ?? [];
  };

  async getAllTeamChampions(): Promise<string[]> {
    const data = await fetch(`${this.url}/team-champions/`);
    return await (await data.json()).team_champions ?? [];
  }

  async getAllEnemyTeamChampions(): Promise<string[]> {
    const data = await fetch(`${this.url}/enemy-team-champions/`);
    return await (await data.json()).enemy_team_champions ?? [];
  }

  async getAllVideos(): Promise<Video[]> {
    console.log(`getAllVideos`);
    const data = await fetch(this.url + '/ytvideos/?is_active=true');
    return await data.json() ?? [];
  }

  async getVideoById(id: string): Promise<Video | undefined> {
    console.log(`getVideoById: ${id}`);
    const data = await fetch(`${this.url}/ytvideos/${id}`);
    if (data.status !== 200) {
      return undefined;
    }
    return await data.json();
  }

  // Centralized method to fetch and manage all initialization data
  async fetchInitialData() {
    return Promise.all([
      this.getAllChampions(),
      this.getAllEnemyChampions(),
      this.getAllRunes(),
      this.getAllChampionItems(),
      this.getAllTeamChampions(),
      this.getAllEnemyTeamChampions(),
      this.getAllVideos(),
    ]);
  }

  async filterVideos(
    champion: string,
    lane: string,
    enemy_champion: string,
    runes: string,
    championItems: string,
    teamChampions: string,
    enemyTeamChampions: string,
  ): Promise<Video[]> {
    let cleanedLane = lane.replace('Any', '');
    console.log(`filterVideos called with -
    champion: ${champion},
    lane: ${cleanedLane},
    enemy_champion: ${enemy_champion},
    items: ${championItems},
    runes: ${runes},
    team_champions: ${teamChampions},
    enemy_team_champions: ${enemyTeamChampions}`);

    const response = await fetch(
      `${this.url}/ytvideos/?is_active=true&` +
      `champion=${encodeURIComponent(champion)}` +
      `&lane=${encodeURIComponent(cleanedLane)}` +
      `&enemy_champion=${encodeURIComponent(enemy_champion)}` +
      `&runes=${encodeURIComponent(runes)}` +
      `&team_champions=${encodeURIComponent(teamChampions)}` +
      `&enemy_team_champions=${encodeURIComponent(enemyTeamChampions)}` +
      `&champion_items=${encodeURIComponent(championItems)}`
    );
    return await response.json() ?? [];
  }

  async getInactiveVideos(): Promise<Video[]> {
    console.log(`getInactiveVideos`);
    const data = await fetch(`${this.url}/ytvideos/?is_active=false`);
    return await data.json() ?? [];
  }

  async activateVideoById(videoId: string) {
    console.log(`activateVideoById: ${videoId}`);
    await fetch(`${this.url}/ytvideos/activate/${videoId}/`, {
      method: 'POST',
    });
  }

  constructor() {

  }
}
