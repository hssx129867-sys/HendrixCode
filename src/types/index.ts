export type MiniGameId = 'pattern' | 'bugSquash' | 'logicPath';

export type AvatarType = 'star' | 'robot' | 'lightbulb' | 'rocket';

export interface GameProgress {
  stars: number;
  levelsCompleted: number;
}

export interface PlayerProgress {
  [gameId: string]: GameProgress;
}

export interface Player {
  id: string;
  name: string;
  favoriteColor: string;
  avatarType: AvatarType;
  progress: PlayerProgress;
}

export interface ChristmasListItem {
  id: string;
  name: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: number;
}

export interface ChristmasList {
  playerId: string;
  items: ChristmasListItem[];
  lastUpdated: number;
}
