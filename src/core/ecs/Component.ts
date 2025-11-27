/**
 * Base interface for all components.
 * Components are pure data containers with no logic.
 */
export interface IComponent {
  readonly type: string;
}

/**
 * Component type registry for type-safe component management.
 */
export class ComponentRegistry {
  private static types: Map<string, new (...args: unknown[]) => IComponent> = new Map();

  /**
   * Registers a component type.
   */
  static register<T extends IComponent>(
    type: string,
    constructor: new (...args: unknown[]) => T
  ): void {
    if (this.types.has(type)) {
      console.warn(`Component type "${type}" is already registered`);
      return;
    }
    this.types.set(type, constructor);
  }

  /**
   * Gets a component constructor by type.
   */
  static get(type: string): (new (...args: unknown[]) => IComponent) | undefined {
    return this.types.get(type);
  }

  /**
   * Checks if a component type is registered.
   */
  static has(type: string): boolean {
    return this.types.has(type);
  }

  /**
   * Gets all registered component types.
   */
  static getTypes(): string[] {
    return Array.from(this.types.keys());
  }

  /**
   * Clears all registered types (mainly for testing).
   */
  static clear(): void {
    this.types.clear();
  }
}

/**
 * ComponentManager stores and manages components for entities.
 * Uses a sparse set pattern for efficient iteration and lookup.
 */
export class ComponentManager<T extends IComponent> {
  private entityToIndex: Map<number, number> = new Map();
  private indexToEntity: number[] = [];
  private components: T[] = [];

  /**
   * Adds a component to an entity.
   */
  addComponent(entity: number, component: T): void {
    if (this.entityToIndex.has(entity)) {
      // Update existing component
      const index = this.entityToIndex.get(entity)!;
      this.components[index] = component;
    } else {
      // Add new component
      const index = this.components.length;
      this.entityToIndex.set(entity, index);
      this.indexToEntity.push(entity);
      this.components.push(component);
    }
  }

  /**
   * Removes a component from an entity.
   */
  removeComponent(entity: number): void {
    const index = this.entityToIndex.get(entity);
    if (index === undefined) return;

    // Swap with last element for O(1) removal
    const lastIndex = this.components.length - 1;
    if (index !== lastIndex) {
      const lastEntity = this.indexToEntity[lastIndex];
      
      // Move last element to deleted position
      this.components[index] = this.components[lastIndex];
      this.indexToEntity[index] = lastEntity;
      this.entityToIndex.set(lastEntity, index);
    }

    // Remove last element
    this.components.pop();
    this.indexToEntity.pop();
    this.entityToIndex.delete(entity);
  }

  /**
   * Gets a component for an entity.
   */
  getComponent(entity: number): T | undefined {
    const index = this.entityToIndex.get(entity);
    return index !== undefined ? this.components[index] : undefined;
  }

  /**
   * Checks if an entity has this component type.
   */
  hasComponent(entity: number): boolean {
    return this.entityToIndex.has(entity);
  }

  /**
   * Gets all components (for iteration).
   */
  getAllComponents(): T[] {
    return this.components;
  }

  /**
   * Gets all entities that have this component type.
   */
  getEntities(): number[] {
    return [...this.indexToEntity];
  }

  /**
   * Gets the count of components.
   */
  getComponentCount(): number {
    return this.components.length;
  }

  /**
   * Clears all components.
   */
  clear(): void {
    this.entityToIndex.clear();
    this.indexToEntity = [];
    this.components = [];
  }

  /**
   * Iterates over all entities with components.
   */
  forEach(callback: (entity: number, component: T) => void): void {
    for (let i = 0; i < this.components.length; i++) {
      callback(this.indexToEntity[i], this.components[i]);
    }
  }
}
