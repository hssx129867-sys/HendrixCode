# AR Game Foundation - Architecture

## Overview

This document describes the architecture of the AR Game Foundation, a modular and extensible framework for building augmented reality games across multiple platforms (iOS ARKit, Android ARCore, and WebXR).

## Core Principles

1. **Platform Agnostic**: Core engine logic is independent of any specific AR platform
2. **ECS-Based**: Entity Component System architecture for flexible game object composition
3. **Clean Abstractions**: Well-defined interfaces separate concerns between layers
4. **Type Safety**: Full TypeScript implementation with strict typing
5. **Testability**: Mock-friendly design for comprehensive testing

## Architecture Layers

### Layer 1: Core Engine (Platform-Agnostic)

The core engine provides fundamental game engine capabilities without any platform-specific code.

#### Entity Component System (ECS)

The foundation uses a data-oriented ECS architecture:

- **Entity**: Unique identifier (number) representing a game object
- **Component**: Pure data containers (no logic)
- **System**: Logic processors that operate on entities with specific components
- **World**: Container managing all entities, components, and systems

**Benefits:**
- Composition over inheritance
- Cache-friendly data layout
- Easy to add/remove behaviors at runtime
- Better performance for large numbers of entities

**Files:**
- `src/core/ecs/Entity.ts`: Entity management
- `src/core/ecs/Component.ts`: Component base types and registry
- `src/core/ecs/System.ts`: System base class and lifecycle
- `src/core/ecs/World.ts`: World container and coordination

#### Math Library

Custom math library providing essential 3D math operations:

- **Vector2**: 2D vectors for screen coordinates and 2D math
- **Vector3**: 3D position, direction, scale
- **Quaternion**: Rotation representation (gimbal-lock free)
- **Matrix4**: 4x4 transformation matrices
- **Transform**: Combined position, rotation, scale

**Files:**
- `src/core/math/Vector2.ts`
- `src/core/math/Vector3.ts`
- `src/core/math/Quaternion.ts`
- `src/core/math/Matrix4.ts`
- `src/core/math/Transform.ts`

#### Scene System

Hierarchical scene graph for organizing game objects:

- **Scene**: Root container for all game objects
- **SceneNode**: Hierarchical node with transform and children
- **SceneManager**: Handles scene loading, unloading, and transitions

**Features:**
- Parent-child relationships
- Transform propagation
- Scene serialization/deserialization
- Multiple scene support

**Files:**
- `src/core/scene/Scene.ts`
- `src/core/scene/SceneNode.ts`
- `src/core/scene/SceneManager.ts`

#### Input Abstraction

Platform-agnostic input handling:

- **Touch Events**: Tap, drag, pinch gestures
- **Raycast**: 3D ray from screen point for object selection
- **Input Manager**: Event aggregation and dispatching

**Files:**
- `src/core/input/InputManager.ts`
- `src/core/input/TouchInput.ts`
- `src/core/input/Raycast.ts`

### Layer 2: Platform Adapters

Platform adapters implement AR-specific functionality while conforming to shared interfaces.

#### Shared AR Interfaces

All platform adapters implement these interfaces:

```typescript
interface IARSession {
  start(): Promise<void>;
  stop(): void;
  update(): void;
  isSupported(): boolean;
}

interface IARFrame {
  timestamp: number;
  camera: IARCamera;
  planes: IARPlane[];
}

interface IARPlane {
  id: string;
  transform: Matrix4;
  extent: Vector2;
  type: 'horizontal' | 'vertical';
}

interface IARHitTestResult {
  position: Vector3;
  rotation: Quaternion;
  plane?: IARPlane;
}

interface IARAnchor {
  id: string;
  transform: Matrix4;
  tracking: boolean;
}
```

**Files:**
- `src/platform/ARInterfaces.ts`

#### ARKit Adapter (iOS)

Implements AR functionality using Apple's ARKit:

- Session lifecycle management
- Plane detection and tracking
- Hit testing for placement
- Camera pose tracking
- Anchor creation and management

**Files:**
- `src/platform/mobile/arkit/ARKitSession.ts`
- `src/platform/mobile/arkit/ARKitAdapter.ts`

#### ARCore Adapter (Android)

Implements AR functionality using Google's ARCore:

- Similar capabilities to ARKit adapter
- Android-specific initialization
- Motion tracking
- Environmental understanding

**Files:**
- `src/platform/mobile/arcore/ARCoreSession.ts`
- `src/platform/mobile/arcore/ARCoreAdapter.ts`

#### WebXR Adapter

Implements AR for web browsers supporting WebXR:

- WebXR session management
- Hit test API
- Anchor API
- Feature detection

**Files:**
- `src/platform/web/WebXRSession.ts`
- `src/platform/web/WebXRAdapter.ts`

### Layer 3: Game Implementation

#### Component Library

Reusable components for game objects:

- `TransformComponent`: Position, rotation, scale
- `MeshComponent`: 3D model reference
- `ColliderComponent`: Collision detection
- `TargetComponent`: Game-specific target data
- `ScoreComponent`: Score tracking
- `UIComponent`: UI element data

**Files:**
- `src/core/components/TransformComponent.ts`
- `src/core/components/MeshComponent.ts`
- `src/core/components/ColliderComponent.ts`
- (additional components as needed)

#### System Library

Game logic systems:

- `RenderSystem`: Visual rendering
- `PhysicsSystem`: Collision detection and response
- `TargetSpawnSystem`: Spawns targets at intervals
- `TargetMovementSystem`: Moves targets
- `HitDetectionSystem`: Detects player hits on targets
- `ScoreSystem`: Manages scoring
- `GameStateSystem`: Game flow and state management

**Files:**
- `src/core/systems/RenderSystem.ts`
- `src/core/systems/PhysicsSystem.ts`
- (additional systems as needed)

## Sample Game: AR Target Drop

### Game Flow

1. **Initialization**: AR session starts, detecting planes
2. **Placement**: Player taps to place spawn pad on detected plane
3. **Gameplay**: Targets spawn periodically, player taps to destroy
4. **Scoring**: Points awarded per target, displayed on UI
5. **Win Condition**: Reach target score or time limit

### System Interaction

```
GameLoop
  ├─> ARSession.update()
  ├─> InputManager.update()
  ├─> TargetSpawnSystem.update()
  ├─> TargetMovementSystem.update()
  ├─> HitDetectionSystem.update()
  ├─> ScoreSystem.update()
  ├─> GameStateSystem.update()
  └─> RenderSystem.update()
```

### Files

- `src/samples/ar-mini-game/ARTargetDrop.ts`: Main game controller
- `src/samples/ar-mini-game/systems/`: Game-specific systems
- `src/samples/ar-mini-game/components/`: Game-specific components

## Demo Applications

### AR Demo

Simple demonstrations of core AR capabilities:

1. **Place Cube**: Basic plane detection and object placement
2. **Rotate Gesture**: Gesture-based object manipulation
3. **Hit Test Move**: Move objects using hit testing

**Files:**
- `src/samples/ar-demo/PlaceCubeDemo.ts`
- `src/samples/ar-demo/RotateGestureDemo.ts`
- `src/samples/ar-demo/HitTestMoveDemo.ts`

## Data Flow

```
User Input (Touch)
  ↓
InputManager (platform-agnostic)
  ↓
Systems (process input, update game state)
  ↓
World (manages entities/components)
  ↓
RenderSystem (visual output)
  ↓
AR Platform (display in AR)
```

## Performance Considerations

1. **ECS Benefits**: Data-oriented design for cache efficiency
2. **Component Storage**: Contiguous arrays for better memory access patterns
3. **System Ordering**: Critical systems run first (input, physics, then rendering)
4. **Pooling**: Object pooling for frequently created/destroyed entities
5. **LOD**: Level-of-detail for distant objects (future enhancement)

## Extension Points

The architecture is designed to be extended:

1. **New Components**: Add component types to `src/core/components/`
2. **New Systems**: Add systems to `src/core/systems/`
3. **New Platforms**: Implement `IARSession` for additional platforms
4. **New Games**: Create new game directories under `src/samples/`

## Testing Strategy

- **Unit Tests**: Individual classes and functions
- **Integration Tests**: System interactions and workflows
- **Mock AR**: Simulated AR sessions for testing without devices
- **Platform Tests**: Platform-specific adapter tests

See `tests/` directory for test implementations.

## Build and Deployment

- **Development**: `npm run dev` - Vite dev server with HMR
- **Production**: `npm run build` - TypeScript compilation + Vite build
- **Testing**: `npm test` - Run test suite
- **Linting**: `npm run lint` - ESLint checks

## Conclusion

This architecture provides a solid foundation for AR game development with:
- Clear separation of concerns
- Platform portability
- Type safety
- Testability
- Extensibility

The modular design allows teams to work independently on different layers while maintaining system coherence.
