/**
 * Entity is a unique identifier for a game object.
 * Entities are just numbers - all data is stored in components.
 */
export type Entity = number;

/**
 * EntityManager handles entity creation and destruction.
 */
export class EntityManager {
  private nextEntityId: number = 0;
  private activeEntities: Set<Entity> = new Set();
  private recycledIds: Entity[] = [];

  /**
   * Creates a new entity.
   */
  createEntity(): Entity {
    let id: Entity;
    
    if (this.recycledIds.length > 0) {
      id = this.recycledIds.pop()!;
    } else {
      id = this.nextEntityId++;
    }
    
    this.activeEntities.add(id);
    return id;
  }

  /**
   * Destroys an entity, allowing its ID to be recycled.
   */
  destroyEntity(entity: Entity): void {
    if (this.activeEntities.has(entity)) {
      this.activeEntities.delete(entity);
      this.recycledIds.push(entity);
    }
  }

  /**
   * Checks if an entity is active.
   */
  isActive(entity: Entity): boolean {
    return this.activeEntities.has(entity);
  }

  /**
   * Gets all active entities.
   */
  getActiveEntities(): Entity[] {
    return Array.from(this.activeEntities);
  }

  /**
   * Gets the count of active entities.
   */
  getEntityCount(): number {
    return this.activeEntities.size;
  }

  /**
   * Clears all entities.
   */
  clear(): void {
    this.activeEntities.clear();
    this.recycledIds = [];
    this.nextEntityId = 0;
  }
}
