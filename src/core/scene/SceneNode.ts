import { Entity } from '../ecs/Entity';
import { TransformComponent } from '../components/TransformComponent';
import { Transform } from '../math/Transform';

/**
 * SceneNode represents a node in the scene hierarchy.
 */
export class SceneNode {
  public entity: Entity;
  public transform: TransformComponent;
  public parent: SceneNode | null = null;
  public children: SceneNode[] = [];
  public name: string;
  public active: boolean = true;

  constructor(entity: Entity, transform: TransformComponent, name: string = '') {
    this.entity = entity;
    this.transform = transform;
    this.name = name || `Entity_${entity}`;
  }

  /**
   * Adds a child node to this node.
   */
  addChild(child: SceneNode): void {
    if (child.parent) {
      child.parent.removeChild(child);
    }
    
    child.parent = this;
    this.children.push(child);
    child.transform.setParent(this.transform);
  }

  /**
   * Removes a child node from this node.
   */
  removeChild(child: SceneNode): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      child.parent = null;
      child.transform.setParent(null);
    }
  }

  /**
   * Removes this node from its parent.
   */
  removeFromParent(): void {
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }

  /**
   * Gets all descendant nodes (recursive).
   */
  getDescendants(): SceneNode[] {
    const descendants: SceneNode[] = [];
    for (const child of this.children) {
      descendants.push(child);
      descendants.push(...child.getDescendants());
    }
    return descendants;
  }

  /**
   * Finds a child node by name (non-recursive).
   */
  findChild(name: string): SceneNode | null {
    return this.children.find(child => child.name === name) || null;
  }

  /**
   * Finds a descendant node by name (recursive).
   */
  findDescendant(name: string): SceneNode | null {
    const found = this.findChild(name);
    if (found) return found;

    for (const child of this.children) {
      const descendant = child.findDescendant(name);
      if (descendant) return descendant;
    }

    return null;
  }

  /**
   * Updates this node and all children (propagates transforms).
   */
  update(): void {
    if (!this.active) return;

    // Update children
    for (const child of this.children) {
      child.update();
    }
  }

  /**
   * Gets the world transform for this node.
   */
  getWorldTransform(): Transform {
    return new Transform(
      this.transform.getWorldPosition(),
      this.transform.getWorldRotation(),
      this.transform.transform.scale.clone()
    );
  }
}
