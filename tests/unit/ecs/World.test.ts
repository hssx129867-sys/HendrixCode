import { describe, it, expect, beforeEach } from 'vitest';
import { World } from '../../../src/core/ecs/World';
import { System } from '../../../src/core/ecs/System';
import { IComponent } from '../../../src/core/ecs/Component';

// Test component
class TestComponent implements IComponent {
  readonly type: string = 'test';
  constructor(public value: number = 0) {}
}

// Test system
class TestSystem extends System {
  readonly name: string = 'TestSystem';
  public updateCount: number = 0;
  public lastDeltaTime: number = 0;

  update(deltaTime: number): void {
    this.updateCount++;
    this.lastDeltaTime = deltaTime;
  }
}

describe('ECS World', () => {
  let world: World;

  beforeEach(() => {
    world = new World();
  });

  describe('Entity Management', () => {
    it('should create entities with unique IDs', () => {
      const entity1 = world.createEntity();
      const entity2 = world.createEntity();
      expect(entity1).not.toBe(entity2);
    });

    it('should destroy entities', () => {
      const entity = world.createEntity();
      world.destroyEntity(entity);
      
      const manager = world.getEntityManager();
      expect(manager.isActive(entity)).toBe(false);
    });

    it('should track entity count', () => {
      const entity1 = world.createEntity();
      const entity2 = world.createEntity();
      
      const stats = world.getStats();
      expect(stats.entityCount).toBe(2);
      
      world.destroyEntity(entity1);
      expect(world.getStats().entityCount).toBe(1);
    });
  });

  describe('Component Management', () => {
    it('should add components to entities', () => {
      const entity = world.createEntity();
      const component = new TestComponent(42);
      
      world.addComponent(entity, component);
      expect(world.hasComponent(entity, 'test')).toBe(true);
    });

    it('should get components from entities', () => {
      const entity = world.createEntity();
      const component = new TestComponent(42);
      
      world.addComponent(entity, component);
      const retrieved = world.getComponent<TestComponent>(entity, 'test');
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.value).toBe(42);
    });

    it('should remove components from entities', () => {
      const entity = world.createEntity();
      const component = new TestComponent(42);
      
      world.addComponent(entity, component);
      world.removeComponent(entity, 'test');
      
      expect(world.hasComponent(entity, 'test')).toBe(false);
    });

    it('should get entities with specific component types', () => {
      const entity1 = world.createEntity();
      const entity2 = world.createEntity();
      const entity3 = world.createEntity();
      
      world.addComponent(entity1, new TestComponent(1));
      world.addComponent(entity2, new TestComponent(2));
      
      const entities = world.getEntitiesWithComponent('test');
      expect(entities.length).toBe(2);
      expect(entities).toContain(entity1);
      expect(entities).toContain(entity2);
      expect(entities).not.toContain(entity3);
    });
  });

  describe('System Management', () => {
    it('should add systems', () => {
      const system = new TestSystem();
      world.addSystem(system);
      
      const retrieved = world.getSystem('TestSystem');
      expect(retrieved).toBe(system);
    });

    it('should update systems', () => {
      const system = new TestSystem();
      world.addSystem(system);
      world.start();
      
      world.update();
      
      expect(system.updateCount).toBeGreaterThan(0);
    });

    it('should pass delta time to systems', () => {
      const system = new TestSystem();
      world.addSystem(system);
      world.start();
      
      const deltaTime = 16.67; // ~60fps
      world.update(performance.now() + deltaTime);
      
      expect(system.lastDeltaTime).toBeGreaterThan(0);
    });

    it('should remove systems', () => {
      const system = new TestSystem();
      world.addSystem(system);
      
      world.removeSystem('TestSystem');
      
      const retrieved = world.getSystem('TestSystem');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('World Lifecycle', () => {
    it('should start and stop', () => {
      world.start();
      world.stop();
      // If this doesn't throw, the test passes
      expect(true).toBe(true);
    });

    it('should clear all data', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new TestComponent());
      world.addSystem(new TestSystem());
      
      world.clear();
      
      const stats = world.getStats();
      expect(stats.entityCount).toBe(0);
      expect(stats.systemCount).toBe(0);
    });
  });

  describe('World Stats', () => {
    it('should provide accurate stats', () => {
      const entity1 = world.createEntity();
      const entity2 = world.createEntity();
      world.addComponent(entity1, new TestComponent());
      world.addSystem(new TestSystem());
      
      const stats = world.getStats();
      
      expect(stats.entityCount).toBe(2);
      expect(stats.systemCount).toBe(1);
      expect(stats.componentTypeCount).toBeGreaterThanOrEqual(1);
    });
  });
});
