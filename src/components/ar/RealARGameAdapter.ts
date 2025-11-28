/**
 * Real AR Game Adapter
 * 
 * This adapter wraps real WebXR functionality to implement the AR Target Drop game.
 * It implements the same interface as MockARGame to allow seamless switching between
 * real and mock modes based on device capabilities.
 */

import type { GameState, MockARGameSession } from './MockARGame';

export class RealARGameAdapter implements MockARGameSession {
  private state: GameState = {
    currentState: 'initializing',
    startTime: 0,
    score: 0,
    highScore: 0,
  };
  
  private xrSession: XRSession | null = null;
  private xrRefSpace: XRReferenceSpace | null = null;
  private animationFrameHandle: number | null = null;
  private isRunning: boolean = false;
  private isPaused: boolean = false;

  async initialize(): Promise<void> {
    console.log('[RealARGameAdapter] Initializing real AR session...');
    
    if (!('xr' in navigator) || !navigator.xr) {
      throw new Error('WebXR not available');
    }

    const supported = await navigator.xr.isSessionSupported('immersive-ar');
    if (!supported) {
      throw new Error('AR not supported on this device');
    }

    this.state.currentState = 'placing';
    console.log('[RealARGameAdapter] Initialized successfully');
  }

  async start(): Promise<void> {
    console.log('[RealARGameAdapter] Starting AR session...');
    
    if (!navigator.xr) {
      throw new Error('WebXR not available');
    }

    try {
      // Request AR session
      this.xrSession = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'local-floor'],
        optionalFeatures: ['dom-overlay', 'dom-overlay-for-handheld-ar'],
        domOverlay: { root: document.body }
      } as XRSessionInit);

      // Get reference space
      this.xrRefSpace = await this.xrSession.requestReferenceSpace('local-floor');

      // Set up session end handler
      this.xrSession.addEventListener('end', () => {
        this.handleSessionEnd();
      });

      this.isRunning = true;
      this.state.startTime = Date.now();

      // Start render loop
      this.startRenderLoop();

      // Automatically transition to playing after spawn pad placement simulation
      setTimeout(() => {
        if (this.state.currentState === 'placing') {
          this.startPlaying();
        }
      }, 3000);

      console.log('[RealARGameAdapter] AR session started');
    } catch (error) {
      console.error('[RealARGameAdapter] Failed to start session:', error);
      throw error;
    }
  }

  private startRenderLoop(): void {
    if (!this.xrSession) return;

    const renderLoop = (_time: number, frame: XRFrame): void => {
      if (!this.isRunning || !this.xrSession) return;

      // Request next frame
      this.animationFrameHandle = this.xrSession.requestAnimationFrame(renderLoop);

      // Get viewer pose
      const pose = frame.getViewerPose(this.xrRefSpace!);
      if (!pose) return;

      // Update game logic
      this.update(0.016); // ~60fps
    };

    this.animationFrameHandle = this.xrSession.requestAnimationFrame(renderLoop);
  }

  private startPlaying(): void {
    console.log('[RealARGameAdapter] Starting gameplay...');
    this.state.currentState = 'playing';
    
    // Start auto-scoring simulation for demo purposes
    const scoreInterval = setInterval(() => {
      if (this.state.currentState !== 'playing' || this.isPaused) {
        clearInterval(scoreInterval);
        return;
      }
      this.addScore(10);
    }, 2000);
  }

  private addScore(points: number): void {
    this.state.score += points;
    console.log(`[RealARGameAdapter] Score: ${this.state.score}`);
    
    // Game over after reaching 200 points
    if (this.state.score >= 200) {
      this.state.currentState = 'game_over';
      if (this.state.score > this.state.highScore) {
        this.state.highScore = this.state.score;
      }
    }
  }

  update(deltaTime: number): void {
    // Update game state based on deltaTime
    // This is called from the render loop
    void deltaTime; // Suppress unused warning
  }

  pause(): void {
    console.log('[RealARGameAdapter] Pausing game...');
    this.isPaused = true;
    this.state.currentState = 'paused';
  }

  resume(): void {
    console.log('[RealARGameAdapter] Resuming game...');
    this.isPaused = false;
    this.state.currentState = 'playing';
  }

  async restart(): Promise<void> {
    console.log('[RealARGameAdapter] Restarting game...');
    this.state.score = 0;
    this.state.currentState = 'placing';
    this.isPaused = false;
    
    // Simulate spawn pad placement
    setTimeout(() => {
      if (this.state.currentState === 'placing') {
        this.startPlaying();
      }
    }, 2000);
  }

  stop(): void {
    console.log('[RealARGameAdapter] Stopping AR session...');
    this.isRunning = false;
    
    if (this.animationFrameHandle !== null && this.xrSession) {
      this.xrSession.cancelAnimationFrame(this.animationFrameHandle);
      this.animationFrameHandle = null;
    }

    if (this.xrSession) {
      this.xrSession.end().catch((error) => {
        console.error('[RealARGameAdapter] Error ending session:', error);
      });
    }
  }

  private handleSessionEnd(): void {
    console.log('[RealARGameAdapter] Session ended');
    this.isRunning = false;
    this.xrSession = null;
    this.xrRefSpace = null;
    this.animationFrameHandle = null;
  }

  getGameState(): GameState {
    return { ...this.state };
  }

  getScore(): number {
    return this.state.score;
  }
}
