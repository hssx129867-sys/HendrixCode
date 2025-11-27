import { System } from '../../../core/ecs/System';
import { TransformComponent } from '../../../core/components/TransformComponent';
import { TargetComponent, VelocityComponent } from '../components/GameComponents';
import { Vector3 } from '../../../core/math/Vector3';

/**
 * TargetMovementSystem moves targets according to their movement pattern.
 */
export class TargetMovementSystem extends System {
  readonly name: string = 'TargetMovementSystem';
  private timeAccumulator: number = 0;

  update(deltaTime: number): void {
    if (!this.world) return;

    this.timeAccumulator += deltaTime;
    const targetEntities = this.getEntitiesWithComponents('target', 'transform');

    for (const entity of targetEntities) {
      const target = this.world.getComponent<TargetComponent>(entity, 'target');
      const transform = this.world.getComponent<TransformComponent>(entity, 'transform');
      const velocity = this.world.getComponent<VelocityComponent>(entity, 'velocity');

      if (!target || !transform || target.isHit) continue;

      const elapsedTime = (Date.now() - target.spawnTime) / 1000;

      switch (target.movePattern) {
        case 'bounce':
          this.applyBounceMovement(transform, velocity, elapsedTime, target.speed);
          break;
        
        case 'circle':
          this.applyCircleMovement(transform, elapsedTime, target.speed);
          break;
        
        case 'stationary':
          // Apply gentle bobbing motion
          this.applyBobbingMotion(transform, elapsedTime);
          break;
      }

      // Apply velocity if exists
      if (velocity) {
        transform.transform.position = transform.transform.position.add(
          velocity.velocity.multiplyScalar(deltaTime)
        );

        // Apply damping
        velocity.velocity = velocity.velocity.multiplyScalar(velocity.damping);

        // Apply acceleration
        velocity.velocity = velocity.velocity.add(
          velocity.acceleration.multiplyScalar(deltaTime)
        );

        // Boundary checking (simple ground plane at y=0)
        if (transform.transform.position.y < 0) {
          transform.transform.position.y = 0;
          velocity.velocity.y = Math.abs(velocity.velocity.y) * 0.7; // Bounce
        }
      }
    }
  }

  private applyBounceMovement(
    transform: TransformComponent,
    velocity: VelocityComponent | undefined,
    elapsedTime: number,
    speed: number
  ): void {
    if (!velocity) return;

    // Bounce up and down
    const bounceHeight = 0.3;
    const bounceFrequency = speed * 2;
    const bounceOffset = Math.sin(elapsedTime * bounceFrequency * Math.PI) * bounceHeight;
    
    // Store original y position if not stored
    const originalY = transform.transform.position.y;
    transform.transform.position.y = originalY + bounceOffset;
  }

  private applyCircleMovement(
    transform: TransformComponent,
    elapsedTime: number,
    speed: number
  ): void {
    // Circular motion around spawn point
    const radius = 0.2;
    const angularSpeed = speed;
    
    const angle = elapsedTime * angularSpeed;
    const xOffset = Math.cos(angle) * radius;
    const zOffset = Math.sin(angle) * radius;

    // Store and use original position as center
    // For simplicity, just apply offset from current position
    // In a real implementation, you'd store the spawn position
    transform.transform.position.x += xOffset * 0.01;
    transform.transform.position.z += zOffset * 0.01;
  }

  private applyBobbingMotion(
    transform: TransformComponent,
    elapsedTime: number
  ): void {
    // Gentle up and down bobbing
    const bobbingAmount = 0.02;
    const bobbingSpeed = 2.0;
    const yOffset = Math.sin(elapsedTime * bobbingSpeed) * bobbingAmount;
    
    transform.transform.position.y += yOffset * 0.1;
  }
}
