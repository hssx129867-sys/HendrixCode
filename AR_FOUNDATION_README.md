# AR Game Foundation

A complete AR game engine foundation with ~5,400 lines of production-ready code.

## Overview

This directory contains a modular AR game foundation built from scratch, including:

- **Core Engine** (`src/core/`): Platform-agnostic game engine with ECS, math, scene management, and input
- **Platform Adapters** (`src/platform/`): AR implementations for ARKit, ARCore, and WebXR
- **Sample Game** (`src/samples/ar-mini-game/`): Complete playable AR Target Drop game
- **Demos** (`src/samples/ar-demo/`): Simple AR demonstrations
- **Documentation** (`docs/`): Architecture, platform guides, and coding standards
- **Tests** (`tests/`): Unit and integration tests

## Features

### Core Engine
- **ECS Architecture**: Entity-Component-System for flexible game object composition
- **Math Library**: Vector2, Vector3, Quaternion, Matrix4, Transform with full 3D math operations
- **Scene System**: Hierarchical scene graph with load/unload support
- **Input System**: Touch gestures (tap, drag, pinch), raycasting, keyboard input
- **Component Library**: Transform, Mesh, Collider components

### Platform Support
- **WebXR**: Browser-based AR for Chrome, Edge, Firefox
- **ARKit**: iOS AR (mock implementation - requires native integration)
- **ARCore**: Android AR (mock implementation - requires native integration)
- **Auto-detection**: Automatically selects best available platform

### AR Target Drop Game
A complete sample game demonstrating the foundation:
- Plane detection and placement
- Target spawning with different movement patterns
- Hit detection with raycasting
- Scoring system with combos
- Game state management (menu, placing, playing, game over)
- 60-second timed gameplay

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Run Tests
```bash
npm run test
```

### Build
```bash
npm run build
```

## Project Structure

```
├── docs/                          # Documentation
│   ├── architecture.md           # System architecture
│   ├── ar-platforms.md          # Platform comparison & mapping
│   └── coding-standards.md      # Coding guidelines
├── src/
│   ├── core/                     # Core engine (platform-agnostic)
│   │   ├── ecs/                 # Entity Component System
│   │   ├── math/                # Math library
│   │   ├── scene/               # Scene management
│   │   ├── input/               # Input handling
│   │   ├── components/          # Reusable components
│   │   └── systems/             # Reusable systems
│   ├── platform/                 # Platform-specific AR adapters
│   │   ├── ARInterfaces.ts     # Shared AR interfaces
│   │   ├── ARSessionFactory.ts # Platform detection
│   │   ├── web/                 # WebXR implementation
│   │   └── mobile/              # ARKit & ARCore (mock)
│   └── samples/                  # Sample games and demos
│       ├── ar-mini-game/        # AR Target Drop game
│       └── ar-demo/             # Simple demonstrations
├── tests/                        # Tests
│   ├── unit/                    # Unit tests
│   └── integration/             # Integration tests
└── .github/workflows/           # CI/CD pipelines

```

## Code Statistics

- **Production Code**: ~5,400 lines
- **Documentation**: ~1,400 lines
- **Tests**: ~360 lines
- **Total**: ~7,160 lines

## Architecture

### ECS (Entity Component System)
The foundation uses a data-oriented ECS architecture:

```typescript
// Create world
const world = new World();

// Create entity
const entity = world.createEntity();

// Add components
world.addComponent(entity, new TransformComponent(position));
world.addComponent(entity, new MeshComponent('cube'));

// Add systems
world.addSystem(new RenderSystem());
world.addSystem(new PhysicsSystem());

// Game loop
world.start();
world.update(deltaTime);
```

### Platform Abstraction

All AR platforms implement the same interface:

```typescript
const session = await ARSessionFactory.create();

if (await session.isSupported()) {
  await session.start();
  
  // Hit test to find surfaces
  const hits = await session.hitTest(screenX, screenY);
  
  // Place anchors
  const anchor = await session.createAnchor(position, rotation);
}
```

### Sample Game Usage

```typescript
import { ARTargetDrop } from './samples/ar-mini-game/ARTargetDrop';

const game = new ARTargetDrop();
await game.initialize();
await game.start();

// Game loop
function gameLoop() {
  game.update();
  requestAnimationFrame(gameLoop);
}
gameLoop();
```

## Documentation

- **[Architecture Guide](docs/architecture.md)**: Detailed system architecture and design decisions
- **[Platform Guide](docs/ar-platforms.md)**: ARKit, ARCore, and WebXR comparison and integration
- **[Coding Standards](docs/coding-standards.md)**: Code style, naming conventions, and best practices

## Testing

### Run All Tests
```bash
npm test
```

### Run Specific Tests
```bash
npm test -- Vector3
npm test -- World
```

### Coverage
```bash
npm run test:coverage
```

### Test Structure
- Unit tests for math, ECS, and core systems
- Integration tests for AR session workflows
- Mock AR sessions for testing without devices

## Building

The AR foundation is TypeScript-based and can be built independently:

```bash
# Type check
npx tsc --noEmit -p tsconfig.ar.json

# Build for production
npm run build
```

## CI/CD

GitHub Actions workflows:
- **CI** (`.github/workflows/ci.yml`): Build, test, lint on push/PR
- **Lint** (`.github/workflows/lint.yml`): Code style checks

## Browser Support

### WebXR Support
- Chrome 79+ (Android)
- Edge 79+ (Windows Mixed Reality)
- Samsung Internet 11.2+ (Android)

### Requirements
- HTTPS (required for WebXR)
- Camera permissions
- AR-capable device

## Development

### Adding New Components

```typescript
import { IComponent } from './core/ecs/Component';

export class MyComponent implements IComponent {
  readonly type: string = 'myComponent';
  
  constructor(public value: number) {}
}
```

### Adding New Systems

```typescript
import { System } from './core/ecs/System';

export class MySystem extends System {
  readonly name: string = 'MySystem';
  
  update(deltaTime: number): void {
    const entities = this.getEntitiesWithComponents('myComponent');
    // Process entities...
  }
}
```

### Creating New Games

1. Create game directory in `src/samples/`
2. Define game-specific components
3. Implement game systems
4. Create game controller
5. Add tests

## Performance

### Optimizations
- Data-oriented ECS for cache efficiency
- Object pooling for frequently created entities
- Sparse set pattern for component storage
- Fixed timestep physics updates
- Minimal allocations in hot paths

### Target Performance
- 60 FPS on mid-range devices
- < 100ms initialization
- < 16ms per frame update

## Known Limitations

1. **ARKit/ARCore**: Mock implementations provided - full native integration requires platform-specific code
2. **WebXR**: Limited to browser-supported features (plane detection varies)
3. **3D Rendering**: Basic primitive shapes only - full rendering engine not included
4. **Physics**: Simplified collision detection - full physics engine not included

## Future Enhancements

- [ ] Full 3D rendering with WebGL/Three.js integration
- [ ] Advanced physics system
- [ ] Multiplayer/networking support
- [ ] Asset loading pipeline
- [ ] Audio system
- [ ] Particle effects
- [ ] Animation system
- [ ] Editor tooling

## Contributing

1. Follow the coding standards in `docs/coding-standards.md`
2. Write tests for new features
3. Update documentation
4. Run linter and tests before committing

## License

This is a demonstration project created as part of the HendrixCode repository.

## Acknowledgments

Built as a comprehensive AR game foundation demonstrating:
- Modern TypeScript architecture
- ECS design patterns
- Cross-platform AR development
- Clean code principles
- Test-driven development
