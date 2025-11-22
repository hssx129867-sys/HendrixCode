import type { Player } from '../types';

const STORAGE_KEY = 'bestBoysData';
const ACTIVE_PLAYER_KEY = 'bestBoysActivePlayer';

export const getPlayers = (): Player[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultPlayers();
  } catch (error) {
    console.error('Error reading players from localStorage:', error);
    return getDefaultPlayers();
  }
};

export const savePlayers = (players: Player[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  } catch (error) {
    console.error('Error saving players to localStorage:', error);
  }
};

export const getActivePlayerId = (): string | null => {
  return localStorage.getItem(ACTIVE_PLAYER_KEY);
};

export const setActivePlayerId = (id: string): void => {
  localStorage.setItem(ACTIVE_PLAYER_KEY, id);
};

export const getDefaultPlayers = (): Player[] => {
  return [
    {
      id: '1',
      name: 'Hendrix',
      favoriteColor: '#FF6B6B',
      avatarType: 'rocket',
      progress: {},
    },
    {
      id: '2',
      name: 'Isaac',
      favoriteColor: '#4ECDC4',
      avatarType: 'robot',
      progress: {},
    },
    {
      id: '3',
      name: 'Hendrix',
      favoriteColor: '#95E1D3',
      avatarType: 'star',
      progress: {},
    },
  ];
};

export const updatePlayerProgress = (
  playerId: string,
  gameId: string,
  stars: number,
  levelsCompleted: number
): void => {
  const players = getPlayers();
  const player = players.find((p) => p.id === playerId);
  
  if (player) {
    if (!player.progress[gameId]) {
      player.progress[gameId] = { stars: 0, levelsCompleted: 0 };
    }
    
    player.progress[gameId].stars = Math.max(player.progress[gameId].stars, stars);
    player.progress[gameId].levelsCompleted = Math.max(player.progress[gameId].levelsCompleted, levelsCompleted);
    
    savePlayers(players);
  }
};
