import { Matrix4 } from '../core/math/Matrix4';
import { Vector2 } from '../core/math/Vector2';
import { Vector3 } from '../core/math/Vector3';
import { Quaternion } from '../core/math/Quaternion';

/**
 * AR session interface - all platform adapters must implement this.
 */
export interface IARSession {
  /**
   * Starts the AR session.
   */
  start(): Promise<void>;

  /**
   * Stops the AR session.
   */
  stop(): void;

  /**
   * Updates the AR session (call every frame).
   */
  update(): void;

  /**
   * Checks if AR is supported on this device/platform.
   */
  isSupported(): Promise<boolean>;

  /**
   * Gets the current AR frame.
   */
  getCurrentFrame(): IARFrame | null;

  /**
   * Performs a hit test to find surfaces at a screen point.
   */
  hitTest(screenX: number, screenY: number): Promise<IARHitTestResult[]>;

  /**
   * Creates an anchor at a specific position and rotation.
   */
  createAnchor(position: Vector3, rotation: Quaternion): Promise<IARAnchor | null>;

  /**
   * Removes an anchor.
   */
  removeAnchor(anchorId: string): void;

  /**
   * Gets all active anchors.
   */
  getAnchors(): IARAnchor[];
}

/**
 * AR frame interface - represents a single frame of AR data.
 */
export interface IARFrame {
  /**
   * Frame timestamp in milliseconds.
   */
  timestamp: number;

  /**
   * Camera information for this frame.
   */
  camera: IARCamera;

  /**
   * Detected planes in this frame.
   */
  planes: IARPlane[];

  /**
   * Lighting estimation for this frame.
   */
  lightEstimate?: IARLightEstimate;
}

/**
 * AR camera interface.
 */
export interface IARCamera {
  /**
   * Camera transform (position and rotation).
   */
  transform: Matrix4;

  /**
   * Camera projection matrix.
   */
  projectionMatrix: Matrix4;

  /**
   * Camera tracking state.
   */
  trackingState: ARTrackingState;
}

/**
 * AR plane interface - represents a detected surface.
 */
export interface IARPlane {
  /**
   * Unique identifier for this plane.
   */
  id: string;

  /**
   * Plane transform (position and rotation).
   */
  transform: Matrix4;

  /**
   * Plane extent (width and length).
   */
  extent: Vector2;

  /**
   * Plane type (horizontal or vertical).
   */
  type: ARPlaneType;

  /**
   * Center point of the plane.
   */
  center: Vector3;

  /**
   * Whether this plane is currently being tracked.
   */
  tracking: boolean;
}

/**
 * AR hit test result interface.
 */
export interface IARHitTestResult {
  /**
   * Hit position in world space.
   */
  position: Vector3;

  /**
   * Hit rotation (surface orientation).
   */
  rotation: Quaternion;

  /**
   * Distance from camera to hit point.
   */
  distance: number;

  /**
   * The plane that was hit (if any).
   */
  plane?: IARPlane;
}

/**
 * AR anchor interface - a fixed point in space.
 */
export interface IARAnchor {
  /**
   * Unique identifier for this anchor.
   */
  id: string;

  /**
   * Anchor transform (position and rotation).
   */
  transform: Matrix4;

  /**
   * Whether this anchor is currently being tracked.
   */
  tracking: boolean;

  /**
   * Creation timestamp.
   */
  createdAt: number;
}

/**
 * AR light estimate interface.
 */
export interface IARLightEstimate {
  /**
   * Ambient light intensity (0-1).
   */
  ambientIntensity: number;

  /**
   * Ambient light color temperature in Kelvin.
   */
  colorTemperature?: number;

  /**
   * Primary light direction.
   */
  primaryLightDirection?: Vector3;

  /**
   * Primary light intensity.
   */
  primaryLightIntensity?: number;
}

/**
 * AR tracking state enum.
 */
export enum ARTrackingState {
  /** Tracking is not available. */
  NOT_AVAILABLE = 'not_available',
  
  /** Tracking is limited (poor lighting, lack of features, etc.). */
  LIMITED = 'limited',
  
  /** Tracking is working normally. */
  NORMAL = 'normal',
}

/**
 * AR plane type enum.
 */
export enum ARPlaneType {
  /** Horizontal plane (floor, table, etc.). */
  HORIZONTAL = 'horizontal',
  
  /** Vertical plane (wall, door, etc.). */
  VERTICAL = 'vertical',
}

/**
 * AR session configuration.
 */
export interface ARSessionConfig {
  /**
   * Enable plane detection.
   */
  planeDetection?: boolean;

  /**
   * Enable light estimation.
   */
  lightEstimation?: boolean;

  /**
   * Enable depth sensing (if available).
   */
  depthSensing?: boolean;

  /**
   * Prefer front or back camera.
   */
  cameraFacing?: 'front' | 'back';
}

/**
 * AR session error types.
 */
export class ARSessionError extends Error {
  constructor(
    message: string,
    public code: string,
    public platform: string
  ) {
    super(message);
    this.name = 'ARSessionError';
  }
}
