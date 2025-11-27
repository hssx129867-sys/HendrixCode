import { World } from '../../core/ecs/World';
import { Scene } from '../../core/scene/Scene';
import { InputManager } from '../../core/input/InputManager';
import { IARSession } from '../../platform/ARInterfaces';
import { ARSessionFactory } from '../../platform/ARSessionFactory';
import { TransformComponent } from '../../core/components/TransformComponent';
import { PrimitiveShapeComponent, ShapeType } from '../../core/components/MeshComponent';
import { Vector3 } from '../../core/math/Vector3';
import { GestureType } from '../../core/input/TouchInput';

/**
 * Simple demo showing how to place a cube in AR.
 */
export class PlaceCubeDemo {
  private world: World;
  private scene: Scene;
  private inputManager: InputManager;
  private arSession: IARSession | null = null;
  private placedCubes: number[] = [];

  constructor() {
    this.world = new World();
    this.scene = new Scene('PlaceCubeDemo', this.world);
    this.inputManager = new InputManager();
  }

  async initialize(): Promise<void> {
    console.log('Initializing Place Cube Demo...');

    // Create AR session
    this.arSession = await ARSessionFactory.create({
      planeDetection: true,
    });

    if (!(await this.arSession.isSupported())) {
      console.error('AR not supported');
      return;
    }

    // Setup input
    this.inputManager.onGesture(GestureType.TAP, async (event) => {
      await this.placeCube(event.position.x, event.position.y);
    });

    this.scene.load();
    console.log('Demo initialized');
  }

  async start(): Promise<void> {
    if (!this.arSession) return;

    await this.arSession.start();
    this.world.start();
    console.log('Demo started - tap to place cubes');
  }

  private async placeCube(screenX: number, screenY: number): Promise<void> {
    if (!this.arSession) return;

    const hitResults = await this.arSession.hitTest(screenX, screenY);
    if (hitResults.length === 0) return;

    const hit = hitResults[0];
    
    // Create cube entity
    const cubeEntity = this.world.createEntity();
    const transform = new TransformComponent(hit.position);
    this.world.addComponent(cubeEntity, transform);

    const cube = new PrimitiveShapeComponent(
      ShapeType.CUBE,
      '#4ecdc4',
      new Vector3(0.1, 0.1, 0.1)
    );
    this.world.addComponent(cubeEntity, cube);

    this.placedCubes.push(cubeEntity);
    console.log(`Placed cube at ${hit.position.toString()}`);
  }

  update(): void {
    this.arSession?.update();
    this.inputManager.update();
    this.world.update();
    this.scene.update();
  }

  stop(): void {
    this.arSession?.stop();
    this.world.stop();
  }
}
