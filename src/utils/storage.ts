import type { Player, ChristmasList, ChristmasListItem } from '../types';

const STORAGE_KEY = 'bestBoysData';
const ACTIVE_PLAYER_KEY = 'bestBoysActivePlayer';
const CHRISTMAS_LISTS_KEY = 'bestBoysChristmasLists';

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

// Christmas List functions
export const getChristmasList = (playerId: string): ChristmasList => {
  try {
    const data = localStorage.getItem(CHRISTMAS_LISTS_KEY);
    const lists: ChristmasList[] = data ? JSON.parse(data) : [];
    const list = lists.find((l) => l.playerId === playerId);
    
    if (list) {
      return list;
    }
    
    return {
      playerId,
      items: [],
      lastUpdated: Date.now(),
    };
  } catch (error) {
    console.error('Error reading Christmas list from localStorage:', error);
    return {
      playerId,
      items: [],
      lastUpdated: Date.now(),
    };
  }
};

export const saveChristmasList = (list: ChristmasList): void => {
  try {
    const data = localStorage.getItem(CHRISTMAS_LISTS_KEY);
    const lists: ChristmasList[] = data ? JSON.parse(data) : [];
    const index = lists.findIndex((l) => l.playerId === list.playerId);
    
    list.lastUpdated = Date.now();
    
    if (index >= 0) {
      lists[index] = list;
    } else {
      lists.push(list);
    }
    
    localStorage.setItem(CHRISTMAS_LISTS_KEY, JSON.stringify(lists));
  } catch (error) {
    console.error('Error saving Christmas list to localStorage:', error);
  }
};

export const addChristmasItem = (playerId: string, item: Omit<ChristmasListItem, 'id' | 'createdAt'>): void => {
  const list = getChristmasList(playerId);
  const newItem: ChristmasListItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: Date.now(),
  };
  
  list.items.push(newItem);
  saveChristmasList(list);
};

export const removeChristmasItem = (playerId: string, itemId: string): void => {
  const list = getChristmasList(playerId);
  list.items = list.items.filter((item) => item.id !== itemId);
  saveChristmasList(list);
};

export const updateChristmasItem = (playerId: string, itemId: string, updates: Partial<ChristmasListItem>): void => {
  const list = getChristmasList(playerId);
  const item = list.items.find((i) => i.id === itemId);
  
  if (item) {
    Object.assign(item, updates);
    saveChristmasList(list);
  }
};

export const getDaysUntilChristmas = (): number => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const christmas = new Date(currentYear, 11, 25); // December 25
  
  // If Christmas has passed this year, use next year
  if (today > christmas) {
    christmas.setFullYear(currentYear + 1);
  }
  
  const diffTime = christmas.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};
