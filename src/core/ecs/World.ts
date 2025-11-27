import { Entity, EntityManager } from './Entity';
import { IComponent, ComponentManager } from './Component';
import { System, SystemManager } from './System';

/**
 * World is the central coordinator for the ECS.
 * It manages entities, components, and systems.
 */
export class World {
  private entityManager: EntityManager;
  private systemManager: SystemManager;
  private componentManagers: Map<string, ComponentManager<IComponent>>;
  private isRunning: boolean = false;
  private lastUpdateTime: number = 0;

  // Fixed time step for physics (60 FPS)
  private fixedTimeStep: number = 1 / 60;
  private accumulator: number = 0;

  constructor() {
    this.entityManager = new EntityManager();
    this.systemManager = new SystemManager();
    this.componentManagers = new Map();
  }

  /**
   * Creates a new entity.
   */
  createEntity(): Entity {
    return this.entityManager.createEntity();
  }

  /**
   * Destroys an entity and all its components.
   */
  destroyEntity(entity: Entity): void {
    // Remove all components
    for (const manager of this.componentManagers.values()) {
      manager.removeComponent(entity);
    }
    
    this.entityManager.destroyEntity(entity);
  }

  /**
   * Adds a component to an entity.
   */
  addComponent<T extends IComponent>(entity: Entity, component: T): void {
    const type = component.type;
    
    if (!this.componentManagers.has(type)) {
      this.componentManagers.set(type, new ComponentManager<IComponent>());
    }
    
    this.componentManagers.get(type)!.addComponent(entity, component);
  }

  /**
   * Removes a component from an entity.
   */
  removeComponent(entity: Entity, componentType: string): void {
    const manager = this.componentManagers.get(componentType);
    if (manager) {
      manager.removeComponent(entity);
    }
  }

  /**
   * Gets a component from an entity.
   */
  getComponent<T extends IComponent>(entity: Entity, componentType: string): T | undefined {
    const manager = this.componentManagers.get(componentType);
    return manager?.getComponent(entity) as T | undefined;
  }

  /**
   * Checks if an entity has a specific component type.
   */
  hasComponent(entity: Entity, componentType: string): boolean {
    const manager = this.componentManagers.get(componentType);
    return manager ? manager.hasComponent(entity) : false;
  }

  /**
   * Gets all entities with a specific component type.
   */
  getEntitiesWithComponent(componentType: string): Entity[] {
    const manager = this.componentManagers.get(componentType);
    return manager ? manager.getEntities() : [];
  }

  /**
   * Gets all entities with multiple component types.
   */
  getEntitiesWithComponents(...componentTypes: string[]): Entity[] {
    const allEntities = this.entityManager.getActiveEntities();
    return allEntities.filter(entity => {
      return componentTypes.every(type => this.hasComponent(entity, type));
    });
  }

  /**
   * Adds a system to the world.
   */
  addSystem(system: System): void {
    this.systemManager.addSystem(system, this);
  }

  /**
   * Removes a system from the world.
   */
  removeSystem(systemName: string): void {
    this.systemManager.removeSystem(systemName);
  }

  /**
   * Gets a system by name.
   */
  getSystem(systemName: string): System | undefined {
    return this.systemManager.getSystem(systemName);
  }

  /**
   * Gets the entity manager.
   */
  getEntityManager(): EntityManager {
    return this.entityManager;
  }

  /**
   * Gets the system manager.
   */
  getSystemManager(): SystemManager {
    return this.systemManager;
  }

  /**
   * Starts the world update loop.
   */
  start(): void {
    this.isRunning = true;
    this.lastUpdateTime = performance.now();
  }

  /**
   * Stops the world update loop.
   */
  stop(): void {
    this.isRunning = false;
  }

  /**
   * Updates the world (call this every frame).
   * Handles both variable delta time and fixed time step updates.
   */
  update(currentTime?: number): void {
    if (!this.isRunning) return;

    const now = currentTime ?? performance.now();
    const deltaTime = Math.min((now - this.lastUpdateTime) / 1000, 0.1); // Cap at 100ms
    this.lastUpdateTime = now;

    // Variable delta time update
    this.systemManager.update(deltaTime);

    // Fixed time step update for physics
    this.accumulator += deltaTime;
    while (this.accumulator >= this.fixedTimeStep) {
      this.systemManager.fixedUpdate(this.fixedTimeStep);
      this.accumulator -= this.fixedTimeStep;
    }
  }

  /**
   * Sets the fixed time step for physics updates.
   */
  setFixedTimeStep(timeStep: number): void {
    this.fixedTimeStep = timeStep;
  }

  /**
   * Clears all entities, components, and systems.
   */
  clear(): void {
    this.systemManager.clear();
    this.componentManagers.clear();
    this.entityManager.clear();
    this.accumulator = 0;
  }

  /**
   * Gets stats about the world.
   */
  getStats(): {
    entityCount: number;
    systemCount: number;
    componentTypeCount: number;
  } {
    return {
      entityCount: this.entityManager.getEntityCount(),
      systemCount: this.systemManager.getSystems().length,
      componentTypeCount: this.componentManagers.size,
    };
  }
}
