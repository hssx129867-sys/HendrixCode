import { System, SystemPriority } from '../../../core/ecs/System';
import { TransformComponent } from '../../../core/components/TransformComponent';
import { ColliderComponent } from '../../../core/components/ColliderComponent';
import { TargetComponent, ScoreComponent, AnimationComponent } from '../components/GameComponents';
import { GestureType, GestureEvent } from '../../../core/input/TouchInput';
import { InputManager } from '../../../core/input/InputManager';
import { Vector3 } from '../../../core/math/Vector3';
import { Ray } from '../../../core/input/Raycast';

/**
 * HitDetectionSystem detects when player taps on targets.
 */
export class HitDetectionSystem extends System {
  readonly name: string = 'HitDetectionSystem';
  public priority: number = SystemPriority.EARLY;

  private inputManager: InputManager | null = null;
  private cameraPosition: Vector3 = new Vector3(0, 1.6, 0);
  private cameraDirection: Vector3 = new Vector3(0, 0, -1);

  constructor(inputManager?: InputManager) {
    super();
    if (inputManager) {
      this.inputManager = inputManager;
      this.setupInputListeners();
    }
  }

  setInputManager(inputManager: InputManager): void {
    this.inputManager = inputManager;
    this.setupInputListeners();
  }

  setCameraTransform(position: Vector3, direction: Vector3): void {
    this.cameraPosition = position;
    this.cameraDirection = direction;
  }

  private setupInputListeners(): void {
    if (!this.inputManager) return;

    this.inputManager.onGesture(GestureType.TAP, (event: GestureEvent) => {
      this.handleTap(event);
    });
  }

  private handleTap(event: GestureEvent): void {
    if (!this.world || !this.inputManager) return;

    // Create ray from screen point
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    const ray = this.inputManager.screenPointToRay(
      event.position,
      screenWidth,
      screenHeight,
      this.cameraPosition,
      this.cameraDirection
    );

    // Check for hits on targets
    const hitEntity = this.findHitTarget(ray);
    if (hitEntity !== null) {
      this.handleTargetHit(hitEntity);
    }
  }

  private findHitTarget(ray: Ray): number | null {
    if (!this.world) return null;

    const targetEntities = this.getEntitiesWithComponents('target', 'transform');
    let closestHit: number | null = null;
    let closestDistance = Infinity;

    for (const entity of targetEntities) {
      const target = this.world.getComponent<TargetComponent>(entity, 'target');
      const transform = this.world.getComponent<TransformComponent>(entity, 'transform');

      if (!target || !transform || target.isHit) continue;

      // Simple sphere collision check
      const targetPos = transform.getWorldPosition();
      const targetRadius = 0.1; // Approximate target radius

      const distance = ray.intersectSphere(targetPos, targetRadius);
      if (distance !== null && distance < closestDistance) {
        closestDistance = distance;
        closestHit = entity;
      }
    }

    return closestHit;
  }

  private handleTargetHit(entity: number): void {
    if (!this.world) return;

    const target = this.world.getComponent<TargetComponent>(entity, 'target');
    if (!target || target.isHit) return;

    // Mark target as hit
    target.isHit = true;

    // Update score
    const scoreEntities = this.getEntitiesWithComponents('score');
    if (scoreEntities.length > 0) {
      const scoreComp = this.world.getComponent<ScoreComponent>(scoreEntities[0], 'score');
      if (scoreComp) {
        scoreComp.addPoints(target.points);
      }
    }

    // Add hit animation
    const hitAnim = new AnimationComponent('scale', 300, Date.now(), false);
    this.world.addComponent(entity, hitAnim);

    // Schedule entity destruction
    setTimeout(() => {
      if (this.world) {
        this.world.destroyEntity(entity);
      }
    }, 300);
  }

  update(deltaTime: number): void {
    // Input is handled via gesture callbacks
    // This update method can be used for continuous checks if needed
  }
}
