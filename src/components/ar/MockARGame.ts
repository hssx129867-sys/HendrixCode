export interface GameState {
  currentState: 'initializing' | 'placing' | 'playing' | 'paused' | 'game_over';
  startTime: number;
  score: number;
  highScore: number;
}

export interface MockARGameSession {
  initialize(): Promise<void>;
  start(): Promise<void>;
  stop(): void;
  update(deltaTime: number): void;
  pause(): void;
  resume(): void;
  restart(): Promise<void>;
  getGameState(): GameState;
  getScore(): number;
}

export class MockARGame implements MockARGameSession {
  private state: GameState = {
    currentState: 'initializing',
    startTime: 0,
    score: 0,
    highScore: 0,
  };
  
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private targetsDestroyed: number = 0;
  private autoScoreInterval: number | null = null;

  async initialize(): Promise<void> {
    console.log('[MockARGame] Initializing...');
    
    // Simulate initialization delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('[MockARGame] Checking AR support...');
    
    // Check if WebXR is available
    if ('xr' in navigator && navigator.xr) {
      try {
        const supported = await navigator.xr.isSessionSupported('immersive-ar');
        if (supported) {
          console.log('[MockARGame] WebXR AR is supported!');
        } else {
          console.log('[MockARGame] WebXR available but AR not supported');
        }
      } catch (e) {
        console.log('[MockARGame] WebXR check failed:', e);
      }
    } else {
      console.log('[MockARGame] WebXR not available - using mock mode');
    }
    
    this.state.currentState = 'placing';
    console.log('[MockARGame] Initialized successfully');
  }

  async start(): Promise<void> {
    console.log('[MockARGame] Starting game...');
    
    // Simulate AR session start
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.isRunning = true;
    this.state.startTime = Date.now();
    
    console.log('[MockARGame] Game started - waiting for spawn pad placement');
    
    // Simulate automatic spawn pad placement after 3 seconds
    setTimeout(() => {
      if (this.state.currentState === 'placing' && this.isRunning) {
        this.startPlaying();
      }
    }, 3000);
  }

  private startPlaying(): void {
    console.log('[MockARGame] Spawn pad placed - starting gameplay!');
    this.state.currentState = 'playing';
    
    // Start auto-scoring simulation (simulates hitting targets)
    this.autoScoreInterval = setInterval(() => {
      if (this.state.currentState === 'playing' && !this.isPaused) {
        this.addScore(10);
      }
    }, 2000); // Add points every 2 seconds
  }

  private addScore(points: number): void {
    this.state.score += points;
    this.targetsDestroyed++;
    console.log(`[MockARGame] Target destroyed! Score: ${this.state.score}`);
    
    // Game over after 20 targets
    if (this.targetsDestroyed >= 20) {
      this.gameOver();
    }
  }

  private gameOver(): void {
    console.log('[MockARGame] Game Over!');
    this.state.currentState = 'game_over';
    
    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
      console.log(`[MockARGame] New high score: ${this.state.highScore}`);
    }
    
    if (this.autoScoreInterval) {
      clearInterval(this.autoScoreInterval);
      this.autoScoreInterval = null;
    }
  }

  stop(): void {
    console.log('[MockARGame] Stopping game...');
    this.isRunning = false;
    
    if (this.autoScoreInterval) {
      clearInterval(this.autoScoreInterval);
      this.autoScoreInterval = null;
    }
  }

  update(_deltaTime: number): void {
    // Update game logic here
    // In the real implementation, this would update physics, spawning, etc.
  }

  pause(): void {
    if (this.state.currentState === 'playing') {
      console.log('[MockARGame] Game paused');
      this.isPaused = true;
      this.state.currentState = 'paused';
    }
  }

  resume(): void {
    if (this.state.currentState === 'paused') {
      console.log('[MockARGame] Game resumed');
      this.isPaused = false;
      this.state.currentState = 'playing';
    }
  }

  async restart(): Promise<void> {
    console.log('[MockARGame] Restarting game...');
    
    this.stop();
    
    this.state = {
      currentState: 'initializing',
      startTime: 0,
      score: 0,
      highScore: this.state.highScore,
    };
    
    this.targetsDestroyed = 0;
    this.isPaused = false;
    
    await this.initialize();
    await this.start();
  }

  getGameState(): GameState {
    return { ...this.state };
  }

  getScore(): number {
    return this.state.score;
  }
}
