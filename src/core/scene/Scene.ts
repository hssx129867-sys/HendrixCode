import { World } from '../ecs/World';
import { SceneNode } from './SceneNode';
import { Entity } from '../ecs/Entity';
import { TransformComponent } from '../components/TransformComponent';

/**
 * Scene represents a collection of entities organized in a hierarchy.
 */
export class Scene {
  public name: string;
  public world: World;
  public rootNode: SceneNode;
  public isLoaded: boolean = false;
  private nodeMap: Map<Entity, SceneNode> = new Map();

  constructor(name: string, world: World) {
    this.name = name;
    this.world = world;
    
    // Create root node
    const rootEntity = world.createEntity();
    const rootTransform = new TransformComponent();
    world.addComponent(rootEntity, rootTransform);
    this.rootNode = new SceneNode(rootEntity, rootTransform, 'Root');
    this.nodeMap.set(rootEntity, this.rootNode);
  }

  /**
   * Creates a new scene node.
   */
  createNode(name: string = '', parent: SceneNode = this.rootNode): SceneNode {
    const entity = this.world.createEntity();
    const transform = new TransformComponent();
    this.world.addComponent(entity, transform);

    const node = new SceneNode(entity, transform, name);
    this.nodeMap.set(entity, node);

    parent.addChild(node);

    return node;
  }

  /**
   * Removes a scene node and all its descendants.
   */
  removeNode(node: SceneNode): void {
    // Remove all descendants first
    const descendants = node.getDescendants();
    for (const descendant of descendants) {
      this.world.destroyEntity(descendant.entity);
      this.nodeMap.delete(descendant.entity);
    }

    // Remove the node itself
    node.removeFromParent();
    this.world.destroyEntity(node.entity);
    this.nodeMap.delete(node.entity);
  }

  /**
   * Gets a scene node by entity.
   */
  getNode(entity: Entity): SceneNode | undefined {
    return this.nodeMap.get(entity);
  }

  /**
   * Finds a node by name (searches entire hierarchy).
   */
  findNodeByName(name: string): SceneNode | null {
    return this.rootNode.findDescendant(name);
  }

  /**
   * Gets all nodes in the scene.
   */
  getAllNodes(): SceneNode[] {
    return [this.rootNode, ...this.rootNode.getDescendants()];
  }

  /**
   * Updates the scene (propagates transforms, updates nodes).
   */
  update(): void {
    if (!this.isLoaded) return;
    this.rootNode.update();
  }

  /**
   * Loads the scene (called when scene becomes active).
   */
  load(): void {
    if (this.isLoaded) return;
    this.isLoaded = true;
    this.onLoad();
  }

  /**
   * Unloads the scene (called when scene is deactivated).
   */
  unload(): void {
    if (!this.isLoaded) return;
    this.isLoaded = false;
    this.onUnload();
  }

  /**
   * Override this method to add custom load logic.
   */
  protected onLoad(): void {
    // Override in subclasses
  }

  /**
   * Override this method to add custom unload logic.
   */
  protected onUnload(): void {
    // Override in subclasses
  }

  /**
   * Clears the entire scene (removes all nodes except root).
   */
  clear(): void {
    const descendants = this.rootNode.getDescendants();
    for (const node of descendants) {
      this.world.destroyEntity(node.entity);
      this.nodeMap.delete(node.entity);
    }
    this.rootNode.children = [];
  }

  /**
   * Serializes the scene to JSON (basic implementation).
   */
  toJSON(): object {
    return {
      name: this.name,
      isLoaded: this.isLoaded,
      // TODO: Add entity/component serialization
    };
  }
}
