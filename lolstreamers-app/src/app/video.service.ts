import { Injectable } from '@angular/core';
import { Video, DuplicateCheckResponse } from "./video";
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private url = environment.apiUrl + "/streamers";

  constructor(private http: HttpClient) {}

  async getAllVideos(): Promise<Video[]> {
    const data = await fetch(this.url + '/ytvideos/?is_active=true');
    return await data.json() ?? [];
  }

  async getAllStreamers(): Promise<string[]> {
    const data = await fetch(this.url + '/streamers/');
    return await (await data.json()).streamer ?? [];
  }

  async getVideoById(id: string): Promise<Video | undefined> {
    const data = await fetch(`${this.url}/ytvideos/${id}/`);
    if (data.status !== 200) {
      return undefined;
    }
    return await data.json();
  }

  async filterVideos(
    champion: string,
    lane: string,
    enemy_champion: string,
    runes: string,
    championItems: string,
    teamChampions: string,
    enemyTeamChampions: string,
    streamers: string,
  ): Promise<Video[]> {
    let cleanedLane = lane.replace('Any', '');

    const response = await fetch(
      `${this.url}/ytvideos/?is_active=true&` +
      `champion=${encodeURIComponent(champion)}` +
      `&lane=${encodeURIComponent(cleanedLane)}` +
      `&enemy_champion=${encodeURIComponent(enemy_champion)}` +
      `&runes=${encodeURIComponent(runes)}` +
      `&team_champions=${encodeURIComponent(teamChampions)}` +
      `&enemy_team_champions=${encodeURIComponent(enemyTeamChampions)}` +
      `&champion_items=${encodeURIComponent(championItems)}` +
      `&streamer=${encodeURIComponent(streamers)}`
    );
    return await response.json() ?? [];
  }

  async getInactiveVideos(): Promise<Video[]> {
    // Use HttpClient for automatic token refresh
    try {
      const data = await firstValueFrom(
        this.http.get<Video[]>(`${this.url}/ytvideos/?is_active=false`)
      );
      return data ?? [];
    } catch (error) {
      console.error('Error getting inactive videos:', error);
      return [];
    }
  }

  async activateVideoById(videoId: string) {
    console.log(`activateVideoById: ${videoId}`);
    try {
      // Use HttpClient for automatic token refresh
      await firstValueFrom(
        this.http.post<any>(`${this.url}/ytvideos/activate/${videoId}/`, {})
      );
      return { success: true, message: 'Video activated successfully' };
    } catch (error: any) {
      console.error('Error activating video:', error);
      if (error.status === 401) {
        return { success: false, message: 'Authentication required. Please log in again.' };
      } else {
        return { success: false, message: `Error: ${error.status} - ${error.statusText || 'Unknown error'}` };
      }
    }
  }

  async addVideo(videoData: any): Promise<{ success: boolean; message: string }> {
    const video = {
      video_url: videoData['youtubeUrl'],
      champion: videoData['selectedChampions'],
      enemy_champion: videoData['selectedEnemyChampion'],
      lane: videoData['lane'],
      runes: videoData['selectedRunes'],
      champion_items: videoData['selectedItems'],
      team_champions: videoData['selectedTeamChampions'],
      enemy_team_champions: videoData['selectedEnemyTeamChampions'],
      lol_version: '15',
    };

    try {
      // Use HttpClient for automatic token refresh
      await firstValueFrom(
        this.http.post(`${this.url}/ytvideos/`, video)
      );
      return {success: true, message: 'Video added successfully'};
    } catch (error: any) {
      console.error('Error adding video:', error);
      if (error.status === 400) {
        return {success: false, message: 'Invalid video data submitted'};
      } else if (error.status === 500) {
        return {success: false, message: 'Server error occurred'};
      } else {
        return {success: false, message: `HTTP error! status: ${error.status || 'unknown'}`};
      }
    }
  }

  async updateVideo(video: Video): Promise<{ success: boolean; message: string }> {
    if (video.id === undefined) {
      return {success: false, message: 'Invalid video data submitted'};
    }

    try {
      // Use HttpClient for automatic token refresh via interceptor
      await firstValueFrom(
        this.http.put(`${this.url}/ytvideos/${video.id}/`, video)
      );
      return {success: true, message: 'Video updated successfully'};
    } catch (error: any) {
      console.error('Error updating video:', error);
      if (error.status === 400) {
        return {success: false, message: 'Invalid video data submitted'};
      } else if (error.status === 500) {
        return {success: false, message: 'Server error occurred'};
      } else {
        return {success: false, message: `HTTP error! status: ${error.status || 'unknown'}`};
      }
    }
  }

  deleteVideo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/ytvideos/${id}/`);
  }

  async checkDuplicateVideo(youtubeUrl: string): Promise<DuplicateCheckResponse> {
    try {
      const urlObj = new URL(youtubeUrl);
      const queryParam = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop() || '';
      return await firstValueFrom(
        this.http.get<DuplicateCheckResponse>(`${this.url}/ytvideos/check-duplicate/${queryParam}/`)
      );
    } catch (error) {
      console.error('Error checking for duplicate videos:', error);
      return {hasDuplicates: true, videos: [], message: 'Error checking for duplicates'};
    }
  }

  async getVideoDetails(youtubeUrl: string): Promise<any> {
    try {
      // Backend expects the full YouTube URL in the body as yt_url
      const body = { yt_url: youtubeUrl };

      return await firstValueFrom(
        this.http.post<any>(`${this.url}/ytvideos/league-match/yt/`, body)
      );
    } catch (error: any) {
      if (error?.status === 404) {
        console.warn('No league match information found for this video (404).');
        return null;
      }

      console.error('Error fetching league match details:', error);
      return null;
    }
  }


}
