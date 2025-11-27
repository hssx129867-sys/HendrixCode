import { IComponent } from '../ecs/Component';
import { Vector3 } from '../math/Vector3';

/**
 * Collider types for collision detection.
 */
export enum ColliderType {
  BOX = 'box',
  SPHERE = 'sphere',
  CAPSULE = 'capsule',
}

/**
 * ColliderComponent for collision detection and physics.
 */
export class ColliderComponent implements IComponent {
  readonly type: string = 'collider';

  constructor(
    public colliderType: ColliderType = ColliderType.BOX,
    public size: Vector3 = new Vector3(1, 1, 1),
    public offset: Vector3 = new Vector3(),
    public isTrigger: boolean = false
  ) {}

  /**
   * Checks if a point is inside this collider (simplified version).
   * @param point - Point in local space relative to collider
   */
  containsPoint(point: Vector3): boolean {
    const localPoint = point.subtract(this.offset);

    switch (this.colliderType) {
      case ColliderType.BOX:
        return (
          Math.abs(localPoint.x) <= this.size.x / 2 &&
          Math.abs(localPoint.y) <= this.size.y / 2 &&
          Math.abs(localPoint.z) <= this.size.z / 2
        );
      
      case ColliderType.SPHERE:
        return localPoint.lengthSquared() <= (this.size.x / 2) ** 2;
      
      case ColliderType.CAPSULE:
        // Simplified capsule check
        const radius = this.size.x / 2;
        const height = this.size.y;
        const cylinderTop = height / 2 - radius;
        const cylinderBottom = -height / 2 + radius;

        // Check if within cylinder
        if (localPoint.y >= cylinderBottom && localPoint.y <= cylinderTop) {
          const radialDist = Math.sqrt(
            localPoint.x * localPoint.x + localPoint.z * localPoint.z
          );
          return radialDist <= radius;
        }

        // Check top sphere
        if (localPoint.y > cylinderTop) {
          const topCenter = new Vector3(0, cylinderTop, 0);
          return localPoint.distanceToSquared(topCenter) <= radius * radius;
        }

        // Check bottom sphere
        const bottomCenter = new Vector3(0, cylinderBottom, 0);
        return localPoint.distanceToSquared(bottomCenter) <= radius * radius;

      default:
        return false;
    }
  }
}
