import type { Player, ChristmasList, ChristmasListItem, ChristmasProgress, ElfLocation, ChristmasJoke, SantaLocation } from '../types';

const STORAGE_KEY = 'bestBoysData';
const ACTIVE_PLAYER_KEY = 'bestBoysActivePlayer';
const CHRISTMAS_LISTS_KEY = 'bestBoysChristmasLists';
const CHRISTMAS_PROGRESS_KEY = 'bestBoysChristmasProgress';

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

// Christmas Progress functions
export const getDefaultElves = (): ElfLocation[] => {
  return [
    { id: '1', name: 'Jingle', location: 'Living Room', hint: 'Look near something cozy where the family gathers', found: false },
    { id: '2', name: 'Sparkle', location: 'Kitchen', hint: 'Check where the cookies are baked!', found: false },
    { id: '3', name: 'Twinkle', location: 'Bedroom', hint: 'Search where you lay your head at night', found: false },
    { id: '4', name: 'Snowball', location: 'Bathroom', hint: 'Find me where you brush your teeth', found: false },
    { id: '5', name: 'Candy', location: 'Dining Room', hint: 'Look where the family eats together', found: false },
    { id: '6', name: 'Holly', location: 'Garage', hint: "I'm hiding with the tools and car!", found: false },
    { id: '7', name: 'Ginger', location: 'Backyard', hint: 'Find me outside where you play!', found: false },
    { id: '8', name: 'Peppermint', location: 'Closet', hint: 'Check where clothes are stored', found: false },
    { id: '9', name: 'Sugarplum', location: 'Laundry Room', hint: 'Look where clothes get clean', found: false },
    { id: '10', name: 'Mistletoe', location: 'Stairs', hint: 'Search the steps going up or down', found: false },
    { id: '11', name: 'Nutmeg', location: 'Office/Study', hint: 'Find me where homework is done', found: false },
    { id: '12', name: 'Cinnamon', location: 'Attic/Basement', hint: "I'm in the highest or lowest place!", found: false },
  ];
};

export const getChristmasProgress = (playerId: string): ChristmasProgress => {
  try {
    const data = localStorage.getItem(CHRISTMAS_PROGRESS_KEY);
    const progressList: ChristmasProgress[] = data ? JSON.parse(data) : [];
    const progress = progressList.find((p) => p.playerId === playerId);
    
    if (progress) {
      return progress;
    }
    
    return {
      playerId,
      elvesFound: getDefaultElves(),
      starsCollected: 0,
      lastUpdated: Date.now(),
    };
  } catch (error) {
    console.error('Error reading Christmas progress from localStorage:', error);
    return {
      playerId,
      elvesFound: getDefaultElves(),
      starsCollected: 0,
      lastUpdated: Date.now(),
    };
  }
};

export const saveChristmasProgress = (progress: ChristmasProgress): void => {
  try {
    const data = localStorage.getItem(CHRISTMAS_PROGRESS_KEY);
    const progressList: ChristmasProgress[] = data ? JSON.parse(data) : [];
    const index = progressList.findIndex((p) => p.playerId === progress.playerId);
    
    progress.lastUpdated = Date.now();
    
    if (index >= 0) {
      progressList[index] = progress;
    } else {
      progressList.push(progress);
    }
    
    localStorage.setItem(CHRISTMAS_PROGRESS_KEY, JSON.stringify(progressList));
  } catch (error) {
    console.error('Error saving Christmas progress to localStorage:', error);
  }
};

export const markElfFound = (playerId: string, elfId: string): void => {
  const progress = getChristmasProgress(playerId);
  const elf = progress.elvesFound.find((e) => e.id === elfId);
  
  if (elf && !elf.found) {
    elf.found = true;
    elf.foundAt = Date.now();
    progress.starsCollected += 1;
    saveChristmasProgress(progress);
  }
};

export const resetElvesGame = (playerId: string): void => {
  const progress = getChristmasProgress(playerId);
  progress.elvesFound = getDefaultElves();
  progress.starsCollected = 0;
  saveChristmasProgress(progress);
};

// Christmas Jokes
export const getChristmasJokes = (): ChristmasJoke[] => {
  return [
    { id: '1', joke: 'What do you call an elf who sings?', punchline: 'A wrapper!' },
    { id: '2', joke: 'Why was the snowman looking through the carrots?', punchline: 'He was picking his nose!' },
    { id: '3', joke: 'What do you get if you cross Santa with a duck?', punchline: 'A Christmas Quacker!' },
    { id: '4', joke: 'What do snowmen eat for breakfast?', punchline: 'Frosted Flakes!' },
    { id: '5', joke: 'What do you call a snowman in summer?', punchline: 'A puddle!' },
    { id: '6', joke: 'Why did Santa go to music school?', punchline: 'To improve his wrapping skills!' },
    { id: '7', joke: 'What do elves learn in school?', punchline: 'The elf-abet!' },
    { id: '8', joke: 'How does a snowman get to work?', punchline: 'By icicle!' },
    { id: '9', joke: 'What\'s Santa\'s favorite type of music?', punchline: 'Wrap music!' },
    { id: '10', joke: 'Why is Christmas like a day at the office?', punchline: 'You do all the work and the fat guy in the suit gets all the credit!' },
    { id: '11', joke: 'What do you call a reindeer with no eyes?', punchline: 'No-eye deer!' },
    { id: '12', joke: 'Why did the Christmas tree go to the barber?', punchline: 'It needed a trim!' },
  ];
};

// Santa Tracker
export const getSantaLocation = (): SantaLocation => {
  const daysUntilChristmas = getDaysUntilChristmas();
  const hour = new Date().getHours();
  
  if (daysUntilChristmas === 0) {
    // Christmas Day
    if (hour < 6) {
      return { location: 'Your neighborhood!', activity: 'Delivering presents to your street! 🎁', timestamp: Date.now() };
    } else {
      return { location: 'North Pole', activity: 'Resting after a busy night! 😴', timestamp: Date.now() };
    }
  } else if (daysUntilChristmas < 7) {
    // Final week before Christmas
    const activities = [
      'Checking the naughty and nice list',
      'Loading the sleigh with presents',
      'Feeding the reindeer',
      'Preparing the sleigh for flight',
      'Organizing presents in the workshop',
    ];
    return {
      location: 'North Pole Workshop',
      activity: activities[Math.floor(Math.random() * activities.length)] + ' 🎅',
      timestamp: Date.now(),
    };
  } else {
    // More than a week before Christmas
    const activities = [
      'Reading letters from children',
      'Making toys with the elves',
      'Testing new toy prototypes',
      'Planning the delivery route',
      'Having cookies and milk in the workshop',
    ];
    return {
      location: 'North Pole',
      activity: activities[Math.floor(Math.random() * activities.length)] + ' 🎄',
      timestamp: Date.now(),
    };
  }
};

// Christmas Break Ideas
export const getChristmasBreakIdeas = (): string[] => {
  return [
    '🎨 Make homemade Christmas cards for family and friends',
    '🍪 Bake and decorate Christmas cookies',
    '❄️ Build a snowman or have a snowball fight (if it snows!)',
    '🎬 Watch classic Christmas movies together',
    '🎵 Sing Christmas carols around the house',
    '🎁 Wrap presents for family members',
    '🏠 Decorate your room with Christmas lights',
    '📖 Read Christmas stories before bed',
    '🎄 Make paper snowflakes to hang on windows',
    '🎮 Have a family game night',
    '🍫 Make hot chocolate with marshmallows',
    '✉️ Write a letter to Santa',
    '🎨 Create a Christmas craft project',
    '📸 Take fun Christmas photos with family',
    '🎁 Do a random act of kindness for someone',
    '🌟 Count the Christmas lights in your neighborhood',
    '🎵 Learn a new Christmas song',
    '🍿 Have a movie marathon with snacks',
    '🎨 Draw or paint a winter scene',
    '⭐ Stargaze and look for Santa\'s sleigh',
  ];
};
