export type MiniGameId = 'pattern' | 'bugSquash' | 'logicPath' | 'brainRot' | 'petVet';

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

export interface ElfLocation {
  id: string;
  name: string;
  location: string;
  hint: string;
  found: boolean;
  foundAt?: number;
  capturedPhoto?: string; // Base64 encoded image data
}

export interface ChristmasProgress {
  playerId: string;
  elvesFound: ElfLocation[];
  starsCollected: number;
  lastUpdated: number;
}

export interface ChristmasJoke {
  id: string;
  joke: string;
  punchline: string;
}

export interface SantaLocation {
  location: string;
  activity: string;
  timestamp: number;
}

// Pet Vet Types
export type PetMood = 'happy' | 'sad' | 'excited' | 'tired' | 'sick' | 'energetic';
export type PetColor = 'purple' | 'blue' | 'green' | 'pink' | 'orange' | 'rainbow';
export type AlienAbility = 'teleport' | 'colorChange' | 'shield' | 'glow';

export interface PetStats {
  health: number;      // 0-100
  happiness: number;   // 0-100
  hunger: number;      // 0-100
  energy: number;      // 0-100
}

export interface Pet {
  id: string;
  playerId: string;
  name: string;
  color: PetColor;
  mood: PetMood;
  stats: PetStats;
  abilities: AlienAbility[];
  activeAbility?: AlienAbility;
  level: number;
  experience: number;
  createdAt: number;
  lastFed?: number;
  lastPlayed?: number;
  lastHealed?: number;
  photos: PetPhoto[];
}

export interface PetPhoto {
  id: string;
  dataUrl: string;
  caption?: string;
  stickers: PhotoSticker[];
  createdAt: number;
}

export interface PhotoSticker {
  id: string;
  type: string;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}
