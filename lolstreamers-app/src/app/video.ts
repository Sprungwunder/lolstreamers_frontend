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
  lol_version: string;
}

export interface DuplicateCheckResponse {
  hasDuplicates: boolean;
  message: string;
  videos: Video[];
}
export interface teamMember {
  championName: string;
  lane: string;
  individualPosition: string;
  teamId: number
}

export interface participants {
  teamMembers: teamMember[];
  enemyTeamMembers: teamMember[];
  opponent: teamMember[];
}

export interface LeagueMatchSummary {
  championName: string;
  individualPosition: string;
  item0: string;
  item1: string;
  item2: string;
  item3: string;
  item4: string;
  item5: string;
  primary_runes: string[];
  secondary_runes: string[];
  participants: participants;
}
