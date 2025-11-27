import { IComponent } from '../../../core/ecs/Component';
import { Vector3 } from '../../../core/math/Vector3';

/**
 * TargetComponent marks an entity as a target that can be hit by the player.
 */
export class TargetComponent implements IComponent {
  readonly type: string = 'target';

  constructor(
    public points: number = 10,
    public speed: number = 0.5,
    public movePattern: 'stationary' | 'bounce' | 'circle' = 'bounce',
    public isHit: boolean = false,
    public spawnTime: number = Date.now()
  ) {}
}

/**
 * ScoreComponent tracks the player's score.
 */
export class ScoreComponent implements IComponent {
  readonly type: string = 'score';

  constructor(
    public currentScore: number = 0,
    public targetsHit: number = 0,
    public targetsMissed: number = 0,
    public combo: number = 0,
    public highScore: number = 0
  ) {}

  addPoints(points: number): void {
    this.currentScore += points * (1 + this.combo * 0.1);
    this.targetsHit++;
    this.combo++;
    
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
    }
  }

  resetCombo(): void {
    this.combo = 0;
  }

  missTarget(): void {
    this.targetsMissed++;
    this.resetCombo();
  }
}

/**
 * SpawnPadComponent marks the location where targets spawn.
 */
export class SpawnPadComponent implements IComponent {
  readonly type: string = 'spawnPad';

  constructor(
    public spawnInterval: number = 2000, // ms
    public lastSpawnTime: number = 0,
    public maxActiveTargets: number = 5,
    public isActive: boolean = false
  ) {}

  canSpawn(currentTime: number, activeTargetCount: number): boolean {
    return (
      this.isActive &&
      activeTargetCount < this.maxActiveTargets &&
      currentTime - this.lastSpawnTime >= this.spawnInterval
    );
  }
}

/**
 * GameStateComponent tracks the overall game state.
 */
export class GameStateComponent implements IComponent {
  readonly type: string = 'gameState';

  constructor(
    public state: 'menu' | 'placing' | 'playing' | 'paused' | 'gameover' = 'menu',
    public gameTime: number = 0,
    public gameDuration: number = 60000, // 60 seconds
    public startTime: number = 0
  ) {}

  start(): void {
    this.state = 'playing';
    this.startTime = Date.now();
    this.gameTime = 0;
  }

  pause(): void {
    if (this.state === 'playing') {
      this.state = 'paused';
    }
  }

  resume(): void {
    if (this.state === 'paused') {
      this.state = 'playing';
    }
  }

  end(): void {
    this.state = 'gameover';
  }

  update(): void {
    if (this.state === 'playing') {
      this.gameTime = Date.now() - this.startTime;
      if (this.gameTime >= this.gameDuration) {
        this.end();
      }
    }
  }

  getRemainingTime(): number {
    return Math.max(0, this.gameDuration - this.gameTime);
  }
}

/**
 * VelocityComponent for moving entities.
 */
export class VelocityComponent implements IComponent {
  readonly type: string = 'velocity';

  constructor(
    public velocity: Vector3 = new Vector3(),
    public acceleration: Vector3 = new Vector3(),
    public damping: number = 0.95
  ) {}
}

/**
 * LifetimeComponent for entities that should be destroyed after a duration.
 */
export class LifetimeComponent implements IComponent {
  readonly type: string = 'lifetime';

  constructor(
    public duration: number = 5000, // ms
    public createdAt: number = Date.now()
  ) {}

  isExpired(currentTime: number): boolean {
    return currentTime - this.createdAt >= this.duration;
  }

  getRemainingTime(currentTime: number): number {
    return Math.max(0, this.duration - (currentTime - this.createdAt));
  }
}

/**
 * AnimationComponent for simple animations.
 */
export class AnimationComponent implements IComponent {
  readonly type: string = 'animation';

  constructor(
    public animationType: 'scale' | 'rotate' | 'fade' | 'bounce' = 'scale',
    public duration: number = 1000,
    public startTime: number = Date.now(),
    public loop: boolean = false,
    public scale: number = 1.0,
    public alpha: number = 1.0
  ) {}

  getProgress(currentTime: number): number {
    const elapsed = currentTime - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1.0);
    return this.loop ? (elapsed % this.duration) / this.duration : progress;
  }

  isComplete(currentTime: number): boolean {
    if (this.loop) return false;
    return currentTime - this.startTime >= this.duration;
  }
}
