# Coding Standards

## Overview

This document establishes coding standards for the AR Game Foundation project. Consistent code style improves readability, maintainability, and collaboration.

## Language and Tools

- **Language**: TypeScript 5.9+
- **Build Tool**: Vite 7+
- **Linter**: ESLint 9+
- **Formatter**: Built-in ESLint formatting rules
- **Package Manager**: npm

## File Organization

### Directory Structure

```
src/
├── core/              # Platform-agnostic engine
│   ├── ecs/          # Entity Component System
│   ├── math/         # Math library
│   ├── scene/        # Scene management
│   ├── input/        # Input handling
│   ├── components/   # Reusable components
│   └── systems/      # Reusable systems
├── platform/          # Platform-specific adapters
│   ├── mobile/       # Mobile platforms
│   │   ├── arkit/   # iOS ARKit
│   │   └── arcore/  # Android ARCore
│   └── web/          # WebXR
├── samples/           # Sample games and demos
│   ├── ar-demo/     # Basic AR demos
│   └── ar-mini-game/ # Full sample game
└── utils/            # Shared utilities
```

### File Naming

- **Classes**: PascalCase - `EntityManager.ts`, `Vector3.ts`
- **Interfaces**: PascalCase with 'I' prefix - `IARSession.ts`, `IComponent.ts`
- **Types**: PascalCase - `ComponentType.ts`, `SystemConfig.ts`
- **Functions/Utilities**: camelCase - `mathUtils.ts`, `arrayHelpers.ts`
- **Constants**: UPPER_SNAKE_CASE - `constants.ts` (contains `MAX_ENTITIES`)
- **Tests**: Match source file with `.test.ts` suffix - `Vector3.test.ts`

### Module Structure

Each file should:
1. Have a clear single responsibility
2. Export types/interfaces first
3. Export implementations second
4. Keep related code together

```typescript
// Good: Clear, single-purpose module
// Vector3.ts

// Types and interfaces first
export interface Vector3Data {
  x: number;
  y: number;
  z: number;
}

// Implementation
export class Vector3 implements Vector3Data {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}
  
  // Methods...
}

// Related utilities
export function vec3(x: number, y: number, z: number): Vector3 {
  return new Vector3(x, y, z);
}
```

## TypeScript Style

### Strict Mode

All code must use TypeScript strict mode:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### Type Annotations

- **Always** annotate function parameters and return types
- **Always** annotate public class properties
- **Prefer** explicit types over `any`
- **Use** type inference for local variables when obvious

```typescript
// Good
function calculateDistance(a: Vector3, b: Vector3): number {
  const dx = b.x - a.x; // Type inferred
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Bad
function calculateDistance(a, b) { // Missing types
  return Math.sqrt((b.x-a.x)**2 + (b.y-a.y)**2 + (b.z-a.z)**2);
}
```

### Interfaces vs Types

- **Prefer interfaces** for object shapes and classes
- **Use type aliases** for unions, intersections, and utilities

```typescript
// Interfaces for object shapes
interface IComponent {
  readonly type: string;
}

interface TransformComponent extends IComponent {
  position: Vector3;
  rotation: Quaternion;
  scale: Vector3;
}

// Types for unions and utilities
type ComponentType = 'transform' | 'mesh' | 'collider';
type Nullable<T> = T | null;
type ReadonlyVector3 = Readonly<Vector3>;
```

### Null Safety

- **Use** optional chaining (`?.`) and nullish coalescing (`??`)
- **Avoid** `null` where possible, prefer `undefined`
- **Use** discriminated unions for complex null handling

```typescript
// Good
function getEntityComponent(entity: Entity, type: string): Component | undefined {
  return entity.components?.find(c => c.type === type);
}

const component = getEntityComponent(entity, 'transform');
const position = component?.position ?? new Vector3();

// Bad
function getEntityComponent(entity, type) {
  if (entity && entity.components) {
    return entity.components.find(c => c.type === type) || null;
  }
  return null;
}
```

## Naming Conventions

### Variables and Functions

- **camelCase** for variables and functions
- **Descriptive** names, avoid abbreviations
- **Verb** for functions (get, set, calculate, update, render)
- **Noun** for variables (position, entity, system)

```typescript
// Good
const currentEntity = world.getEntity(entityId);
const targetPosition = calculateTargetPosition(entity);

function updateTransform(entity: Entity, deltaTime: number): void {
  // Implementation
}

// Bad
const e = wrld.get(id); // Too short, unclear
const pos = calc(e); // Abbreviations

function upd(e, dt) { // Unclear, abbreviated
  // Implementation
}
```

### Classes and Interfaces

- **PascalCase** for all class and interface names
- **Descriptive** and specific names
- **Interfaces** prefixed with 'I' for clarity

```typescript
// Good
class EntityManager { }
class TransformSystem extends System { }
interface IARSession { }
interface IComponent { }

// Bad
class manager { } // Should be PascalCase
class Transform_System { } // No underscores
interface ARSession { } // Missing 'I' prefix for interface
```

### Constants

- **UPPER_SNAKE_CASE** for constants
- **Group** related constants in objects or enums

```typescript
// Good
export const MAX_ENTITIES = 10000;
export const DEFAULT_DELTA_TIME = 1/60;

export enum ComponentTypes {
  TRANSFORM = 'transform',
  MESH = 'mesh',
  COLLIDER = 'collider',
}

// Bad
const maxEntities = 10000; // Should be UPPER_SNAKE_CASE
const DefaultDeltaTime = 1/60; // Should be UPPER_SNAKE_CASE
```

## Code Structure

### Class Structure

Order class members consistently:

1. Static properties
2. Static methods
3. Instance properties (public, then private)
4. Constructor
5. Public methods
6. Private methods

```typescript
class Entity {
  // Static
  private static nextId = 0;
  static create(): Entity {
    return new Entity(Entity.nextId++);
  }
  
  // Instance properties
  public readonly id: number;
  private components: Map<string, IComponent>;
  
  // Constructor
  constructor(id: number) {
    this.id = id;
    this.components = new Map();
  }
  
  // Public methods
  public addComponent(component: IComponent): void {
    this.components.set(component.type, component);
  }
  
  public getComponent<T extends IComponent>(type: string): T | undefined {
    return this.components.get(type) as T;
  }
  
  // Private methods
  private validateComponent(component: IComponent): boolean {
    return component.type.length > 0;
  }
}
```

### Function Length

- **Prefer** functions under 50 lines
- **Extract** complex logic into helper functions
- **Single Responsibility**: One function, one purpose

```typescript
// Good: Broken into clear steps
function spawnTarget(world: World, spawnPoint: Vector3): Entity {
  const entity = createTargetEntity(world);
  positionTarget(entity, spawnPoint);
  addTargetComponents(entity);
  return entity;
}

function createTargetEntity(world: World): Entity {
  return world.createEntity();
}

function positionTarget(entity: Entity, position: Vector3): void {
  const transform = entity.getComponent<TransformComponent>('transform');
  if (transform) {
    transform.position = position.clone();
  }
}

// Bad: Too much in one function
function spawnTarget(world, spawnPoint) {
  const entity = world.createEntity();
  entity.addComponent({
    type: 'transform',
    position: { x: spawnPoint.x, y: spawnPoint.y, z: spawnPoint.z },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
    scale: { x: 1, y: 1, z: 1 }
  });
  entity.addComponent({
    type: 'mesh',
    modelId: 'target',
    materialId: 'targetMaterial'
  });
  // ... many more lines ...
  return entity;
}
```

## Comments

### When to Comment

- **Complex algorithms**: Explain the "why", not the "what"
- **Non-obvious behavior**: Clarify unexpected code
- **TODOs**: Mark future work
- **Public APIs**: Document parameters, returns, usage

### When NOT to Comment

- **Obvious code**: Don't state what's clear from reading
- **Commented-out code**: Delete it (use version control)
- **Redundant information**: Type annotations are self-documenting

```typescript
// Good: Explains WHY
// Use quaternions to avoid gimbal lock when rotating around multiple axes
const rotation = Quaternion.fromEuler(pitch, yaw, roll);

// We need to normalize hit test results because some platforms return
// denormalized values which can cause rendering artifacts
const normalizedResult = normalizeHitTestResult(result);

// TODO: Implement object pooling for better performance
const entity = world.createEntity();

// Bad: States the obvious
// Add 1 to x
x = x + 1;

// Get the entity
const entity = world.getEntity(id);

// Create a new Vector3
const position = new Vector3(0, 0, 0);
```

### Documentation Comments

Use JSDoc for public APIs:

```typescript
/**
 * Calculates the distance between two 3D points.
 * 
 * @param a - First point
 * @param b - Second point
 * @returns Euclidean distance between points
 * 
 * @example
 * ```typescript
 * const distance = calculateDistance(
 *   new Vector3(0, 0, 0),
 *   new Vector3(3, 4, 0)
 * );
 * console.log(distance); // 5
 * ```
 */
export function calculateDistance(a: Vector3, b: Vector3): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
```

## Error Handling

### Use Type-Safe Errors

```typescript
// Good: Type-safe error handling
class ARSessionError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly platform: string
  ) {
    super(message);
    this.name = 'ARSessionError';
  }
}

function startARSession(): void {
  if (!isARSupported()) {
    throw new ARSessionError(
      'AR not supported on this device',
      'AR_NOT_SUPPORTED',
      'unknown'
    );
  }
}

// Bad: Generic errors
function startARSession() {
  if (!isARSupported()) {
    throw new Error('AR not supported');
  }
}
```

### Handle Async Errors

```typescript
// Good: Proper async error handling
async function loadModel(path: string): Promise<Model> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load model: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Model loading failed:', error);
    throw error; // Re-throw for caller to handle
  }
}

// Usage
try {
  const model = await loadModel('/models/target.json');
} catch (error) {
  // Handle or display error to user
  showErrorMessage('Failed to load game assets');
}
```

## Testing

### Test File Structure

- Place tests next to source: `Vector3.ts` → `Vector3.test.ts`
- Or in parallel `tests/` directory structure
- Use descriptive test names

```typescript
// Vector3.test.ts
import { describe, it, expect } from 'vitest';
import { Vector3 } from './Vector3';

describe('Vector3', () => {
  describe('constructor', () => {
    it('should create vector with default values', () => {
      const v = new Vector3();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
    });
    
    it('should create vector with provided values', () => {
      const v = new Vector3(1, 2, 3);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
    });
  });
  
  describe('add', () => {
    it('should add two vectors correctly', () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(4, 5, 6);
      const result = a.add(b);
      expect(result.x).toBe(5);
      expect(result.y).toBe(7);
      expect(result.z).toBe(9);
    });
  });
});
```

### Test Coverage

Aim for:
- **Core utilities**: 90%+ coverage
- **Systems**: 80%+ coverage
- **Platform adapters**: Integration tests with mocks
- **Sample games**: Basic smoke tests

## Git Workflow

### Commit Messages

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(ecs): add entity component system core

Implements Entity, Component, System, and World classes
for the core ECS architecture.

- Entity: Unique ID and component container
- Component: Data-only structures
- System: Logic processors
- World: Central coordinator

Closes #123
```

```
fix(arkit): handle session interruption correctly

ARKit sessions can be interrupted by phone calls or switching apps.
Added proper state management to pause/resume gracefully.

Fixes #456
```

### Branch Naming

- `feature/description`: New features
- `fix/description`: Bug fixes
- `docs/description`: Documentation
- `refactor/description`: Code refactoring

## Performance Guidelines

### Avoid Unnecessary Allocations

```typescript
// Good: Reuse objects
class TransformSystem extends System {
  private tempVector = new Vector3();
  
  update(entities: Entity[]): void {
    for (const entity of entities) {
      // Reuse tempVector instead of creating new ones
      this.tempVector.set(0, 1, 0);
      // Use tempVector...
    }
  }
}

// Bad: Creates garbage
class TransformSystem extends System {
  update(entities: Entity[]): void {
    for (const entity of entities) {
      const temp = new Vector3(0, 1, 0); // New allocation each iteration
    }
  }
}
```

### Use Efficient Data Structures

```typescript
// Good: Map for O(1) lookup
class ComponentManager {
  private components = new Map<string, IComponent>();
  
  getComponent(type: string): IComponent | undefined {
    return this.components.get(type); // O(1)
  }
}

// Bad: Array for component lookup
class ComponentManager {
  private components: IComponent[] = [];
  
  getComponent(type: string): IComponent | undefined {
    return this.components.find(c => c.type === type); // O(n)
  }
}
```

## ESLint Configuration

Use provided ESLint config:

```javascript
// eslint.config.js
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
```

## Conclusion

Following these coding standards ensures:
- **Consistency**: Code looks like it was written by one person
- **Readability**: Easy to understand and maintain
- **Quality**: Fewer bugs, better performance
- **Collaboration**: Smooth teamwork and code reviews

When in doubt, refer to this guide or discuss with the team.
