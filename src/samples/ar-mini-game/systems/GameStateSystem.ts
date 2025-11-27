import { System } from '../../../core/ecs/System';
import { GameStateComponent, LifetimeComponent, ScoreComponent } from '../components/GameComponents';

/**
 * GameStateSystem manages the overall game flow and state transitions.
 */
export class GameStateSystem extends System {
  readonly name: string = 'GameStateSystem';

  update(deltaTime: number): void {
    if (!this.world) return;

    const gameStateEntities = this.getEntitiesWithComponents('gameState');
    if (gameStateEntities.length === 0) return;

    const gameState = this.world.getComponent<GameStateComponent>(gameStateEntities[0], 'gameState');
    if (!gameState) return;

    // Update game state
    gameState.update();

    // Check for expired targets (missed targets)
    if (gameState.state === 'playing') {
      this.checkExpiredTargets();
    }

    // Handle game over
    if (gameState.state === 'gameover') {
      this.handleGameOver();
    }
  }

  private checkExpiredTargets(): void {
    if (!this.world) return;

    const currentTime = Date.now();
    const targetEntities = this.getEntitiesWithComponents('target', 'lifetime');

    for (const entity of targetEntities) {
      const lifetime = this.world.getComponent<LifetimeComponent>(entity, 'lifetime');
      if (!lifetime) continue;

      if (lifetime.isExpired(currentTime)) {
        // Target expired without being hit - missed target
        const scoreEntities = this.getEntitiesWithComponents('score');
        if (scoreEntities.length > 0) {
          const score = this.world.getComponent<ScoreComponent>(scoreEntities[0], 'score');
          if (score) {
            score.missTarget();
          }
        }

        // Destroy the entity
        this.world.destroyEntity(entity);
      }
    }
  }

  private handleGameOver(): void {
    // Clean up any remaining targets
    if (!this.world) return;

    const targetEntities = this.getEntitiesWithComponents('target');
    for (const entity of targetEntities) {
      this.world.destroyEntity(entity);
    }
  }
}

/**
 * LifetimeSystem handles entity destruction based on lifetime.
 */
export class LifetimeSystem extends System {
  readonly name: string = 'LifetimeSystem';

  update(deltaTime: number): void {
    if (!this.world) return;

    const currentTime = Date.now();
    const entitiesWithLifetime = this.getEntitiesWithComponents('lifetime');

    for (const entity of entitiesWithLifetime) {
      const lifetime = this.world.getComponent<LifetimeComponent>(entity, 'lifetime');
      if (!lifetime) continue;

      if (lifetime.isExpired(currentTime)) {
        this.world.destroyEntity(entity);
      }
    }
  }
}
