import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';

/**
 * Touch event types.
 */
export enum TouchEventType {
  START = 'start',
  MOVE = 'move',
  END = 'end',
  CANCEL = 'cancel',
}

/**
 * Touch event data.
 */
export interface TouchEvent {
  type: TouchEventType;
  position: Vector2;
  identifier: number;
  timestamp: number;
}

/**
 * Gesture types.
 */
export enum GestureType {
  TAP = 'tap',
  DOUBLE_TAP = 'doubleTap',
  LONG_PRESS = 'longPress',
  DRAG = 'drag',
  PINCH = 'pinch',
  ROTATE = 'rotate',
}

/**
 * Gesture event data.
 */
export interface GestureEvent {
  type: GestureType;
  position: Vector2;
  delta?: Vector2;
  scale?: number;
  rotation?: number;
  timestamp: number;
}

/**
 * TouchInput handles touch events and gesture recognition.
 */
export class TouchInput {
  private activeTouches: Map<number, TouchEvent> = new Map();
  private touchStartPositions: Map<number, Vector2> = new Map();
  private touchStartTime: Map<number, number> = new Map();
  
  private lastTapTime: number = 0;
  private readonly doubleTapThreshold: number = 300; // ms
  private readonly longPressThreshold: number = 500; // ms
  private readonly tapMoveThreshold: number = 10; // pixels

  private listeners: Map<string, Array<(event: GestureEvent) => void>> = new Map();

  constructor(private element: HTMLElement | Window = window) {
    this.setupEventListeners();
  }

  /**
   * Sets up DOM event listeners.
   */
  private setupEventListeners(): void {
    if (this.element instanceof Window) {
      window.addEventListener('touchstart', this.handleTouchStart.bind(this));
      window.addEventListener('touchmove', this.handleTouchMove.bind(this));
      window.addEventListener('touchend', this.handleTouchEnd.bind(this));
      window.addEventListener('touchcancel', this.handleTouchCancel.bind(this));
      
      // Mouse events as fallback
      window.addEventListener('mousedown', this.handleMouseDown.bind(this));
      window.addEventListener('mousemove', this.handleMouseMove.bind(this));
      window.addEventListener('mouseup', this.handleMouseUp.bind(this));
    } else {
      this.element.addEventListener('touchstart', this.handleTouchStart.bind(this) as EventListener);
      this.element.addEventListener('touchmove', this.handleTouchMove.bind(this) as EventListener);
      this.element.addEventListener('touchend', this.handleTouchEnd.bind(this) as EventListener);
      this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this) as EventListener);
      
      this.element.addEventListener('mousedown', this.handleMouseDown.bind(this) as EventListener);
      this.element.addEventListener('mousemove', this.handleMouseMove.bind(this) as EventListener);
      this.element.addEventListener('mouseup', this.handleMouseUp.bind(this) as EventListener);
    }
  }

  /**
   * Handles touch start event.
   */
  private handleTouchStart(event: TouchEvent): void {
    const e = event as unknown as globalThis.TouchEvent;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const position = new Vector2(touch.clientX, touch.clientY);
      
      const touchEvent: TouchEvent = {
        type: TouchEventType.START,
        position,
        identifier: touch.identifier,
        timestamp: Date.now(),
      };

      this.activeTouches.set(touch.identifier, touchEvent);
      this.touchStartPositions.set(touch.identifier, position);
      this.touchStartTime.set(touch.identifier, Date.now());
    }
  }

  /**
   * Handles touch move event.
   */
  private handleTouchMove(event: TouchEvent): void {
    const e = event as unknown as globalThis.TouchEvent;
    e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const position = new Vector2(touch.clientX, touch.clientY);
      const startPos = this.touchStartPositions.get(touch.identifier);

      if (startPos) {
        const delta = position.subtract(startPos);
        
        // Emit drag gesture
        this.emitGesture({
          type: GestureType.DRAG,
          position,
          delta,
          timestamp: Date.now(),
        });
      }

      this.activeTouches.set(touch.identifier, {
        type: TouchEventType.MOVE,
        position,
        identifier: touch.identifier,
        timestamp: Date.now(),
      });
    }

    // Handle pinch gesture
    if (this.activeTouches.size === 2) {
      this.handlePinchGesture();
    }
  }

  /**
   * Handles touch end event.
   */
  private handleTouchEnd(event: TouchEvent): void {
    const e = event as unknown as globalThis.TouchEvent;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const position = new Vector2(touch.clientX, touch.clientY);
      const startPos = this.touchStartPositions.get(touch.identifier);
      const startTime = this.touchStartTime.get(touch.identifier);

      if (startPos && startTime) {
        const distance = position.distanceTo(startPos);
        const duration = Date.now() - startTime;

        // Detect tap
        if (distance < this.tapMoveThreshold) {
          if (duration < this.longPressThreshold) {
            // Check for double tap
            if (Date.now() - this.lastTapTime < this.doubleTapThreshold) {
              this.emitGesture({
                type: GestureType.DOUBLE_TAP,
                position,
                timestamp: Date.now(),
              });
            } else {
              this.emitGesture({
                type: GestureType.TAP,
                position,
                timestamp: Date.now(),
              });
            }
            this.lastTapTime = Date.now();
          } else {
            // Long press
            this.emitGesture({
              type: GestureType.LONG_PRESS,
              position,
              timestamp: Date.now(),
            });
          }
        }
      }

      this.activeTouches.delete(touch.identifier);
      this.touchStartPositions.delete(touch.identifier);
      this.touchStartTime.delete(touch.identifier);
    }
  }

  /**
   * Handles touch cancel event.
   */
  private handleTouchCancel(event: TouchEvent): void {
    const e = event as unknown as globalThis.TouchEvent;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      this.activeTouches.delete(touch.identifier);
      this.touchStartPositions.delete(touch.identifier);
      this.touchStartTime.delete(touch.identifier);
    }
  }

  /**
   * Mouse down handler (fallback for non-touch devices).
   */
  private handleMouseDown(event: MouseEvent): void {
    const position = new Vector2(event.clientX, event.clientY);
    this.activeTouches.set(0, {
      type: TouchEventType.START,
      position,
      identifier: 0,
      timestamp: Date.now(),
    });
    this.touchStartPositions.set(0, position);
    this.touchStartTime.set(0, Date.now());
  }

  /**
   * Mouse move handler (fallback for non-touch devices).
   */
  private handleMouseMove(event: MouseEvent): void {
    if (!this.activeTouches.has(0)) return;

    const position = new Vector2(event.clientX, event.clientY);
    const startPos = this.touchStartPositions.get(0);

    if (startPos) {
      const delta = position.subtract(startPos);
      this.emitGesture({
        type: GestureType.DRAG,
        position,
        delta,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Mouse up handler (fallback for non-touch devices).
   */
  private handleMouseUp(event: MouseEvent): void {
    if (!this.activeTouches.has(0)) return;

    const position = new Vector2(event.clientX, event.clientY);
    const startPos = this.touchStartPositions.get(0);
    const startTime = this.touchStartTime.get(0);

    if (startPos && startTime) {
      const distance = position.distanceTo(startPos);
      const duration = Date.now() - startTime;

      if (distance < this.tapMoveThreshold && duration < this.longPressThreshold) {
        this.emitGesture({
          type: GestureType.TAP,
          position,
          timestamp: Date.now(),
        });
      }
    }

    this.activeTouches.delete(0);
    this.touchStartPositions.delete(0);
    this.touchStartTime.delete(0);
  }

  /**
   * Handles pinch gesture detection.
   */
  private handlePinchGesture(): void {
    const touches = Array.from(this.activeTouches.values());
    if (touches.length !== 2) return;

    const touch1 = touches[0];
    const touch2 = touches[1];
    const distance = touch1.position.distanceTo(touch2.position);

    const startPos1 = this.touchStartPositions.get(touch1.identifier);
    const startPos2 = this.touchStartPositions.get(touch2.identifier);

    if (startPos1 && startPos2) {
      const startDistance = startPos1.distanceTo(startPos2);
      const scale = distance / startDistance;

      const centerPos = touch1.position.add(touch2.position).divideScalar(2);

      this.emitGesture({
        type: GestureType.PINCH,
        position: centerPos,
        scale,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Registers a gesture event listener.
   */
  on(gestureType: GestureType, callback: (event: GestureEvent) => void): void {
    if (!this.listeners.has(gestureType)) {
      this.listeners.set(gestureType, []);
    }
    this.listeners.get(gestureType)!.push(callback);
  }

  /**
   * Unregisters a gesture event listener.
   */
  off(gestureType: GestureType, callback: (event: GestureEvent) => void): void {
    const callbacks = this.listeners.get(gestureType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emits a gesture event to registered listeners.
   */
  private emitGesture(event: GestureEvent): void {
    const callbacks = this.listeners.get(event.type);
    if (callbacks) {
      for (const callback of callbacks) {
        callback(event);
      }
    }
  }

  /**
   * Gets all active touch positions.
   */
  getActiveTouches(): TouchEvent[] {
    return Array.from(this.activeTouches.values());
  }

  /**
   * Clears all active touches.
   */
  clear(): void {
    this.activeTouches.clear();
    this.touchStartPositions.clear();
    this.touchStartTime.clear();
  }
}
