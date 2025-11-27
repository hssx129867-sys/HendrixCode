import { Entity } from './Entity';
import { World } from './World';

/**
 * System priority levels for execution order.
 */
export enum SystemPriority {
  EARLY = 0,
  NORMAL = 100,
  LATE = 200,
}

/**
 * Base class for all systems.
 * Systems contain logic that operates on entities with specific components.
 */
export abstract class System {
  /**
   * System name for debugging and identification.
   */
  abstract readonly name: string;

  /**
   * System priority determines execution order (lower runs first).
   */
  public priority: number = SystemPriority.NORMAL;

  /**
   * Whether this system is currently enabled.
   */
  public enabled: boolean = true;

  /**
   * Reference to the world this system belongs to.
   */
  protected world: World | null = null;

  /**
   * Called when the system is added to a world.
   */
  onInit(world: World): void {
    this.world = world;
  }

  /**
   * Called when the system is removed from a world.
   */
  onDestroy(): void {
    this.world = null;
  }

  /**
   * Called every frame. Implement game logic here.
   * @param deltaTime - Time since last frame in seconds
   */
  abstract update(deltaTime: number): void;

  /**
   * Called at a fixed time interval for physics and deterministic updates.
   * @param fixedDeltaTime - Fixed time step in seconds
   */
  onFixedUpdate(fixedDeltaTime: number): void {
    // Optional: Override if needed
  }

  /**
   * Helper method to get entities with specific component types.
   */
  protected getEntitiesWithComponents(...componentTypes: string[]): Entity[] {
    if (!this.world) return [];
    
    const allEntities = this.world.getEntityManager().getActiveEntities();
    return allEntities.filter(entity => {
      return componentTypes.every(type => this.world!.hasComponent(entity, type));
    });
  }
}

/**
 * System manager handles system lifecycle and execution.
 */
export class SystemManager {
  private systems: System[] = [];
  private systemMap: Map<string, System> = new Map();

  /**
   * Adds a system to the manager.
   */
  addSystem(system: System, world: World): void {
    if (this.systemMap.has(system.name)) {
      console.warn(`System "${system.name}" already exists`);
      return;
    }

    this.systems.push(system);
    this.systemMap.set(system.name, system);
    system.onInit(world);

    // Sort systems by priority
    this.sortSystems();
  }

  /**
   * Removes a system from the manager.
   */
  removeSystem(systemName: string): void {
    const system = this.systemMap.get(systemName);
    if (!system) return;

    system.onDestroy();
    this.systems = this.systems.filter(s => s.name !== systemName);
    this.systemMap.delete(systemName);
  }

  /**
   * Gets a system by name.
   */
  getSystem(systemName: string): System | undefined {
    return this.systemMap.get(systemName);
  }

  /**
   * Gets all systems.
   */
  getSystems(): System[] {
    return [...this.systems];
  }

  /**
   * Updates all enabled systems.
   */
  update(deltaTime: number): void {
    for (const system of this.systems) {
      if (system.enabled) {
        system.update(deltaTime);
      }
    }
  }

  /**
   * Fixed update for all enabled systems.
   */
  fixedUpdate(fixedDeltaTime: number): void {
    for (const system of this.systems) {
      if (system.enabled) {
        system.onFixedUpdate(fixedDeltaTime);
      }
    }
  }

  /**
   * Sorts systems by priority (lower priority runs first).
   */
  private sortSystems(): void {
    this.systems.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Clears all systems.
   */
  clear(): void {
    for (const system of this.systems) {
      system.onDestroy();
    }
    this.systems = [];
    this.systemMap.clear();
  }
}
