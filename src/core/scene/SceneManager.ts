import { Scene } from './Scene';
import { World } from '../ecs/World';

/**
 * SceneManager handles scene loading, unloading, and transitions.
 */
export class SceneManager {
  private scenes: Map<string, Scene> = new Map();
  private activeScene: Scene | null = null;
  private world: World;

  constructor(world: World) {
    this.world = world;
  }

  /**
   * Registers a scene with the manager.
   */
  registerScene(scene: Scene): void {
    if (this.scenes.has(scene.name)) {
      console.warn(`Scene "${scene.name}" is already registered`);
      return;
    }
    this.scenes.set(scene.name, scene);
  }

  /**
   * Unregisters a scene from the manager.
   */
  unregisterScene(sceneName: string): void {
    const scene = this.scenes.get(sceneName);
    if (!scene) return;

    if (this.activeScene === scene) {
      this.unloadScene();
    }

    this.scenes.delete(sceneName);
  }

  /**
   * Loads and activates a scene.
   */
  loadScene(sceneName: string): boolean {
    const scene = this.scenes.get(sceneName);
    if (!scene) {
      console.error(`Scene "${sceneName}" not found`);
      return false;
    }

    // Unload current scene if any
    if (this.activeScene) {
      this.activeScene.unload();
    }

    // Load new scene
    this.activeScene = scene;
    scene.load();

    return true;
  }

  /**
   * Unloads the current active scene.
   */
  unloadScene(): void {
    if (this.activeScene) {
      this.activeScene.unload();
      this.activeScene = null;
    }
  }

  /**
   * Gets the currently active scene.
   */
  getActiveScene(): Scene | null {
    return this.activeScene;
  }

  /**
   * Gets a scene by name.
   */
  getScene(sceneName: string): Scene | undefined {
    return this.scenes.get(sceneName);
  }

  /**
   * Gets all registered scene names.
   */
  getSceneNames(): string[] {
    return Array.from(this.scenes.keys());
  }

  /**
   * Updates the active scene.
   */
  update(): void {
    if (this.activeScene) {
      this.activeScene.update();
    }
  }

  /**
   * Clears all scenes.
   */
  clear(): void {
    if (this.activeScene) {
      this.activeScene.unload();
    }
    this.scenes.clear();
    this.activeScene = null;
  }

  /**
   * Transitions to a new scene with optional fade effect.
   * @param sceneName - Name of the scene to load
   * @param fadeOut - Fade out duration in seconds (0 for instant)
   * @param fadeIn - Fade in duration in seconds (0 for instant)
   */
  async transitionToScene(
    sceneName: string,
    fadeOut: number = 0.5,
    fadeIn: number = 0.5
  ): Promise<boolean> {
    // TODO: Implement actual fade transition
    // For now, just load immediately
    
    if (fadeOut > 0) {
      await this.delay(fadeOut * 1000);
    }

    const success = this.loadScene(sceneName);

    if (fadeIn > 0) {
      await this.delay(fadeIn * 1000);
    }

    return success;
  }

  /**
   * Helper method for delays.
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
