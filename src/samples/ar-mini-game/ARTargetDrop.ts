import { World } from '../../core/ecs/World';
import { Scene } from '../../core/scene/Scene';
import { InputManager } from '../../core/input/InputManager';
import { IARSession } from '../../platform/ARInterfaces';
import { ARSessionFactory } from '../../platform/ARSessionFactory';
import { TransformComponent } from '../../core/components/TransformComponent';
import { PrimitiveShapeComponent, ShapeType } from '../../core/components/MeshComponent';
import {
  GameStateComponent,
  ScoreComponent,
  SpawnPadComponent,
} from './components/GameComponents';
import { TargetSpawnSystem } from './systems/TargetSpawnSystem';
import { TargetMovementSystem } from './systems/TargetMovementSystem';
import { HitDetectionSystem } from './systems/HitDetectionSystem';
import { GameStateSystem, LifetimeSystem } from './systems/GameStateSystem';
import { Vector3 } from '../../core/math/Vector3';
import { GestureType } from '../../core/input/TouchInput';

/**
 * ARTargetDrop - Main game controller for the AR Target Drop sample game.
 */
export class ARTargetDrop {
  private world: World;
  private scene: Scene;
  private inputManager: InputManager;
  private arSession: IARSession | null = null;
  
  private gameStateEntity: number | null = null;
  private scoreEntity: number | null = null;
  private spawnPadEntity: number | null = null;

  private isInitialized: boolean = false;
  private isPlacingSpawnPad: boolean = false;

  constructor() {
    this.world = new World();
    this.scene = new Scene('ARTargetDropGame', this.world);
    this.inputManager = new InputManager();
  }

  /**
   * Initializes the game.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('Initializing AR Target Drop...');

    // Create AR session
    try {
      this.arSession = await ARSessionFactory.create({
        planeDetection: true,
        lightEstimation: true,
      });

      const isSupported = await this.arSession.isSupported();
      if (!isSupported) {
        console.error('AR is not supported on this device');
        return;
      }

      console.log('AR session created successfully');
    } catch (error) {
      console.error('Failed to create AR session:', error);
      return;
    }

    // Create game entities
    this.createGameEntities();

    // Add game systems
    this.addGameSystems();

    // Load scene
    this.scene.load();

    // Setup input handlers
    this.setupInputHandlers();

    this.isInitialized = true;
    console.log('AR Target Drop initialized successfully');
  }

  /**
   * Creates the core game entities.
   */
  private createGameEntities(): void {
    // Create game state entity
    this.gameStateEntity = this.world.createEntity();
    const gameState = new GameStateComponent('placing');
    this.world.addComponent(this.gameStateEntity, gameState);

    // Create score entity
    this.scoreEntity = this.world.createEntity();
    const score = new ScoreComponent();
    this.world.addComponent(this.scoreEntity, score);
  }

  /**
   * Adds game systems to the world.
   */
  private addGameSystems(): void {
    // Add spawn system
    this.world.addSystem(new TargetSpawnSystem());

    // Add movement system
    this.world.addSystem(new TargetMovementSystem());

    // Add hit detection system
    const hitDetectionSystem = new HitDetectionSystem(this.inputManager);
    this.world.addSystem(hitDetectionSystem);

    // Add game state system
    this.world.addSystem(new GameStateSystem());

    // Add lifetime system
    this.world.addSystem(new LifetimeSystem());
  }

  /**
   * Sets up input event handlers.
   */
  private setupInputHandlers(): void {
    this.inputManager.onGesture(GestureType.TAP, (event) => {
      if (this.isPlacingSpawnPad) {
        this.placeSpawnPad(event.position.x, event.position.y);
      }
    });
  }

  /**
   * Starts the AR session and game.
   */
  async start(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.arSession) {
      console.error('AR session not available');
      return;
    }

    try {
      await this.arSession.start();
      console.log('AR session started');

      // Start world update loop
      this.world.start();

      // Enter spawn pad placement mode
      this.enterPlacementMode();

    } catch (error) {
      console.error('Failed to start AR session:', error);
    }
  }

  /**
   * Enters spawn pad placement mode.
   */
  private enterPlacementMode(): void {
    this.isPlacingSpawnPad = true;
    console.log('Tap to place spawn pad...');
  }

  /**
   * Places the spawn pad at the tapped location.
   */
  private async placeSpawnPad(screenX: number, screenY: number): Promise<void> {
    if (!this.arSession || !this.isPlacingSpawnPad) return;

    try {
      // Perform hit test to find surface
      const hitResults = await this.arSession.hitTest(screenX, screenY);
      
      if (hitResults.length === 0) {
        console.log('No surface detected, try again');
        return;
      }

      const hit = hitResults[0];
      
      // Create spawn pad entity
      this.spawnPadEntity = this.world.createEntity();
      
      const transform = new TransformComponent(hit.position);
      this.world.addComponent(this.spawnPadEntity, transform);

      const spawnPad = new SpawnPadComponent(2000, 0, 5, false);
      this.world.addComponent(this.spawnPadEntity, spawnPad);

      // Add visual representation (platform)
      const shape = new PrimitiveShapeComponent(
        ShapeType.CYLINDER,
        '#00ff00',
        new Vector3(0.3, 0.05, 0.3)
      );
      this.world.addComponent(this.spawnPadEntity, shape);

      console.log('Spawn pad placed at:', hit.position.toString());

      // Start the game
      this.startGame();

    } catch (error) {
      console.error('Failed to place spawn pad:', error);
    }
  }

  /**
   * Starts the actual gameplay.
   */
  private startGame(): void {
    this.isPlacingSpawnPad = false;

    // Activate spawn pad
    if (this.spawnPadEntity !== null) {
      const spawnPad = this.world.getComponent<SpawnPadComponent>(this.spawnPadEntity, 'spawnPad');
      if (spawnPad) {
        spawnPad.isActive = true;
      }
    }

    // Start game state
    if (this.gameStateEntity !== null) {
      const gameState = this.world.getComponent<GameStateComponent>(this.gameStateEntity, 'gameState');
      if (gameState) {
        gameState.start();
      }
    }

    console.log('Game started! Tap targets to score points!');
  }

  /**
   * Updates the game (call this every frame).
   */
  update(deltaTime?: number): void {
    if (!this.isInitialized) return;

    // Update AR session
    if (this.arSession) {
      this.arSession.update();
    }

    // Update input
    this.inputManager.update();

    // Update world
    this.world.update();

    // Update scene
    this.scene.update();
  }

  /**
   * Stops the game and AR session.
   */
  stop(): void {
    if (this.arSession) {
      this.arSession.stop();
    }

    this.world.stop();
    console.log('AR Target Drop stopped');
  }

  /**
   * Gets the current game state.
   */
  getGameState(): GameStateComponent | null {
    if (this.gameStateEntity === null) return null;
    return this.world.getComponent<GameStateComponent>(this.gameStateEntity, 'gameState') || null;
  }

  /**
   * Gets the current score.
   */
  getScore(): ScoreComponent | null {
    if (this.scoreEntity === null) return null;
    return this.world.getComponent<ScoreComponent>(this.scoreEntity, 'score') || null;
  }

  /**
   * Pauses the game.
   */
  pause(): void {
    const gameState = this.getGameState();
    if (gameState) {
      gameState.pause();
    }
  }

  /**
   * Resumes the game.
   */
  resume(): void {
    const gameState = this.getGameState();
    if (gameState) {
      gameState.resume();
    }
  }

  /**
   * Restarts the game.
   */
  async restart(): Promise<void> {
    this.stop();
    
    // Clear world
    this.world.clear();
    
    // Reinitialize
    await this.initialize();
    await this.start();
  }
}
