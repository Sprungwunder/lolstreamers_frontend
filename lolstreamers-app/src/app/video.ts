export interface Video {
  id: string;
  ytid: string;
  timestamp: string;
  champion: string;
  champion_items: string[];
  lane: string;
  enemy_champion: string;
  enemy_team_champions: string[];
  runes: string[]
  streamer: string;
  team_champions: string[];
  title: string;
  video_url: string;
  views: number;
  likes: number;
  published_at: string;
}
