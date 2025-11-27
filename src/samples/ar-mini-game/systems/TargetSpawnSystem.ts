import { System } from '../../../core/ecs/System';
import { Entity } from '../../../core/ecs/Entity';
import { TransformComponent } from '../../../core/components/TransformComponent';
import { PrimitiveShapeComponent, ShapeType } from '../../../core/components/MeshComponent';
import { TargetComponent, SpawnPadComponent, VelocityComponent, LifetimeComponent } from '../components/GameComponents';
import { Vector3 } from '../../../core/math/Vector3';

/**
 * TargetSpawnSystem spawns targets at regular intervals.
 */
export class TargetSpawnSystem extends System {
  readonly name: string = 'TargetSpawnSystem';

  update(deltaTime: number): void {
    if (!this.world) return;

    const currentTime = Date.now();
    const spawnPadEntities = this.getEntitiesWithComponents('spawnPad');

    for (const entity of spawnPadEntities) {
      const spawnPad = this.world.getComponent<SpawnPadComponent>(entity, 'spawnPad');
      const transform = this.world.getComponent<TransformComponent>(entity, 'transform');

      if (!spawnPad || !transform) continue;

      // Count active targets
      const activeTargets = this.getEntitiesWithComponents('target').length;

      if (spawnPad.canSpawn(currentTime, activeTargets)) {
        this.spawnTarget(transform.transform.position);
        spawnPad.lastSpawnTime = currentTime;
      }
    }
  }

  private spawnTarget(spawnPosition: Vector3): void {
    if (!this.world) return;

    const targetEntity = this.world.createEntity();

    // Random offset from spawn position
    const offset = new Vector3(
      (Math.random() - 0.5) * 0.5,
      Math.random() * 0.3 + 0.2,
      (Math.random() - 0.5) * 0.5
    );
    const position = spawnPosition.add(offset);

    // Add transform
    const transform = new TransformComponent(position);
    this.world.addComponent(targetEntity, transform);

    // Add target component
    const movePatterns: Array<'stationary' | 'bounce' | 'circle'> = ['stationary', 'bounce', 'circle'];
    const randomPattern = movePatterns[Math.floor(Math.random() * movePatterns.length)];
    const target = new TargetComponent(10, 0.3, randomPattern);
    this.world.addComponent(targetEntity, target);

    // Add visual (primitive shape)
    const shape = new PrimitiveShapeComponent(
      ShapeType.SPHERE,
      this.getRandomColor(),
      new Vector3(0.1, 0.1, 0.1)
    );
    this.world.addComponent(targetEntity, shape);

    // Add velocity for movement
    const initialVelocity = new Vector3(
      (Math.random() - 0.5) * 0.5,
      Math.random() * 0.2,
      (Math.random() - 0.5) * 0.5
    );
    const velocity = new VelocityComponent(initialVelocity);
    this.world.addComponent(targetEntity, velocity);

    // Add lifetime (targets disappear after 10 seconds)
    const lifetime = new LifetimeComponent(10000);
    this.world.addComponent(targetEntity, lifetime);
  }

  private getRandomColor(): string {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#ff8c42'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
