import { IComponent } from '../ecs/Component';
import { Transform } from '../math/Transform';
import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';

/**
 * TransformComponent stores position, rotation, and scale for an entity.
 */
export class TransformComponent implements IComponent {
  readonly type: string = 'transform';
  public transform: Transform;

  // Cached parent transform for hierarchy
  public parent: TransformComponent | null = null;
  public children: TransformComponent[] = [];

  constructor(
    position: Vector3 = new Vector3(),
    rotation: Quaternion = Quaternion.identity(),
    scale: Vector3 = new Vector3(1, 1, 1)
  ) {
    this.transform = new Transform(position, rotation, scale);
  }

  /**
   * Gets the world position (accounting for parent hierarchy).
   */
  getWorldPosition(): Vector3 {
    if (!this.parent) {
      return this.transform.position.clone();
    }
    return this.parent.transform.transformPoint(this.transform.position);
  }

  /**
   * Gets the world rotation (accounting for parent hierarchy).
   */
  getWorldRotation(): Quaternion {
    if (!this.parent) {
      return this.transform.rotation.clone();
    }
    return this.parent.getWorldRotation().multiply(this.transform.rotation);
  }

  /**
   * Sets the parent transform.
   */
  setParent(parent: TransformComponent | null): void {
    // Remove from old parent
    if (this.parent) {
      const index = this.parent.children.indexOf(this);
      if (index !== -1) {
        this.parent.children.splice(index, 1);
      }
    }

    // Set new parent
    this.parent = parent;
    if (parent) {
      parent.children.push(this);
    }
  }

  /**
   * Creates a TransformComponent from a Transform.
   */
  static fromTransform(transform: Transform): TransformComponent {
    return new TransformComponent(
      transform.position.clone(),
      transform.rotation.clone(),
      transform.scale.clone()
    );
  }
}
