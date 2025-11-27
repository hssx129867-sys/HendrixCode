import { TouchInput, TouchEventType, GestureType, GestureEvent, TouchEvent } from './TouchInput';
import { Raycast, Ray, RaycastHit } from './Raycast';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';

/**
 * InputManager centralizes all input handling for the application.
 */
export class InputManager {
  private touchInput: TouchInput;
  private enabled: boolean = true;

  // Keyboard state (for desktop testing)
  private keysPressed: Set<string> = new Set();
  private keysDown: Set<string> = new Set();
  private keysUp: Set<string> = new Set();

  constructor(element: HTMLElement | Window = window) {
    this.touchInput = new TouchInput(element);
    this.setupKeyboardListeners();
  }

  /**
   * Sets up keyboard event listeners.
   */
  private setupKeyboardListeners(): void {
    window.addEventListener('keydown', (e) => {
      if (!this.keysPressed.has(e.key)) {
        this.keysDown.add(e.key);
      }
      this.keysPressed.add(e.key);
    });

    window.addEventListener('keyup', (e) => {
      this.keysPressed.delete(e.key);
      this.keysUp.add(e.key);
    });
  }

  /**
   * Updates input state (call once per frame).
   */
  update(): void {
    // Clear frame-specific key states
    this.keysDown.clear();
    this.keysUp.clear();
  }

  /**
   * Registers a gesture event listener.
   */
  onGesture(gestureType: GestureType, callback: (event: GestureEvent) => void): void {
    if (!this.enabled) return;
    this.touchInput.on(gestureType, callback);
  }

  /**
   * Unregisters a gesture event listener.
   */
  offGesture(gestureType: GestureType, callback: (event: GestureEvent) => void): void {
    this.touchInput.off(gestureType, callback);
  }

  /**
   * Gets all active touch events.
   */
  getActiveTouches(): TouchEvent[] {
    return this.touchInput.getActiveTouches();
  }

  /**
   * Checks if a key is currently pressed.
   */
  isKeyPressed(key: string): boolean {
    return this.keysPressed.has(key);
  }

  /**
   * Checks if a key was just pressed this frame.
   */
  isKeyDown(key: string): boolean {
    return this.keysDown.has(key);
  }

  /**
   * Checks if a key was just released this frame.
   */
  isKeyUp(key: string): boolean {
    return this.keysUp.has(key);
  }

  /**
   * Creates a ray from screen position for raycasting.
   */
  screenPointToRay(
    screenPos: Vector2,
    screenWidth: number,
    screenHeight: number,
    cameraPos: Vector3,
    cameraDirection: Vector3,
    fov?: number
  ): Ray {
    return Raycast.screenPointToRay(
      screenPos,
      screenWidth,
      screenHeight,
      cameraPos,
      cameraDirection,
      fov
    );
  }

  /**
   * Performs a raycast.
   */
  raycast(
    ray: Ray,
    objects: Array<{ center: Vector3; radius: number; entity?: number }>
  ): RaycastHit | null {
    return Raycast.cast(ray, objects);
  }

  /**
   * Enables input handling.
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * Disables input handling.
   */
  disable(): void {
    this.enabled = false;
  }

  /**
   * Clears all input state.
   */
  clear(): void {
    this.touchInput.clear();
    this.keysPressed.clear();
    this.keysDown.clear();
    this.keysUp.clear();
  }
}
