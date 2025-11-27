import { IARSession, ARSessionConfig } from './ARInterfaces';
import { WebXRSession } from './web/WebXRSession';
import { ARKitSession } from './mobile/arkit/ARKitSession';
import { ARCoreSession } from './mobile/arcore/ARCoreSession';

/**
 * AR platform types.
 */
export enum ARPlatform {
  WEBXR = 'webxr',
  ARKIT = 'arkit',
  ARCORE = 'arcore',
  MOCK = 'mock',
}

/**
 * Factory for creating AR sessions based on platform detection.
 */
export class ARSessionFactory {
  /**
   * Creates an AR session for the current platform.
   * Automatically detects the best available platform.
   */
  static async create(config: ARSessionConfig = {}): Promise<IARSession> {
    const platform = await this.detectPlatform();
    return this.createForPlatform(platform, config);
  }

  /**
   * Creates an AR session for a specific platform.
   */
  static createForPlatform(platform: ARPlatform, config: ARSessionConfig = {}): IARSession {
    switch (platform) {
      case ARPlatform.WEBXR:
        return new WebXRSession(config);
      
      case ARPlatform.ARKIT:
        return new ARKitSession(config);
      
      case ARPlatform.ARCORE:
        return new ARCoreSession(config);
      
      case ARPlatform.MOCK:
        return new MockARSession(config);
      
      default:
        console.warn(`Unknown platform ${platform}, using mock session`);
        return new MockARSession(config);
    }
  }

  /**
   * Detects the best available AR platform.
   */
  static async detectPlatform(): Promise<ARPlatform> {
    // Check for WebXR support first (most portable)
    if (navigator.xr) {
      try {
        const supported = await navigator.xr.isSessionSupported('immersive-ar');
        if (supported) {
          return ARPlatform.WEBXR;
        }
      } catch (e) {
        // WebXR not available, continue to other checks
      }
    }

    // Check for iOS/ARKit
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return ARPlatform.ARKIT;
    }

    // Check for Android/ARCore
    if (/android/.test(userAgent)) {
      return ARPlatform.ARCORE;
    }

    // Fallback to mock
    return ARPlatform.MOCK;
  }

  /**
   * Gets the name of the detected platform.
   */
  static async getPlatformName(): Promise<string> {
    const platform = await this.detectPlatform();
    switch (platform) {
      case ARPlatform.WEBXR:
        return 'WebXR';
      case ARPlatform.ARKIT:
        return 'ARKit (iOS)';
      case ARPlatform.ARCORE:
        return 'ARCore (Android)';
      case ARPlatform.MOCK:
        return 'Mock (Testing)';
      default:
        return 'Unknown';
    }
  }
}

/**
 * Mock AR session for testing without AR hardware.
 */
class MockARSession implements IARSession {
  private isRunning: boolean = false;

  constructor(private config: ARSessionConfig = {}) {}

  async isSupported(): Promise<boolean> {
    return true; // Mock is always supported
  }

  async start(): Promise<void> {
    console.log('Mock AR Session started');
    this.isRunning = true;
  }

  stop(): void {
    console.log('Mock AR Session stopped');
    this.isRunning = false;
  }

  update(): void {
    // Mock update
  }

  getCurrentFrame(): import('./ARInterfaces').IARFrame | null {
    if (!this.isRunning) return null;

    // Return mock frame data
    const Matrix4 = require('../core/math/Matrix4').Matrix4;
    const Vector3 = require('../core/math/Vector3').Vector3;
    const Vector2 = require('../core/math/Vector2').Vector2;
    const ARTrackingState = require('./ARInterfaces').ARTrackingState;
    const ARPlaneType = require('./ARInterfaces').ARPlaneType;

    const cameraTransform = new Matrix4();
    cameraTransform.makeTranslation(0, 1.6, 0);

    const projectionMatrix = new Matrix4();
    projectionMatrix.makePerspective(Math.PI / 3, 16 / 9, 0.1, 100);

    return {
      timestamp: Date.now(),
      camera: {
        transform: cameraTransform,
        projectionMatrix,
        trackingState: ARTrackingState.NORMAL,
      },
      planes: [
        {
          id: 'mock_plane',
          transform: new Matrix4().makeTranslation(0, 0, -2),
          extent: new Vector2(2, 2),
          type: ARPlaneType.HORIZONTAL,
          center: new Vector3(0, 0, -2),
          tracking: true,
        },
      ],
    };
  }

  async hitTest(): Promise<import('./ARInterfaces').IARHitTestResult[]> {
    const Vector3 = require('../core/math/Vector3').Vector3;
    const Quaternion = require('../core/math/Quaternion').Quaternion;

    return [
      {
        position: new Vector3(0, 0, -1),
        rotation: Quaternion.identity(),
        distance: 1.0,
      },
    ];
  }

  async createAnchor(position: import('../core/math/Vector3').Vector3): Promise<import('./ARInterfaces').IARAnchor | null> {
    const Matrix4 = require('../core/math/Matrix4').Matrix4;
    const Vector3 = require('../core/math/Vector3').Vector3;
    const Quaternion = require('../core/math/Quaternion').Quaternion;

    return {
      id: `mock_anchor_${Date.now()}`,
      transform: new Matrix4().compose(position, Quaternion.identity(), new Vector3(1, 1, 1)),
      tracking: true,
      createdAt: Date.now(),
    };
  }

  removeAnchor(): void {
    // Mock remove
  }

  getAnchors(): import('./ARInterfaces').IARAnchor[] {
    return [];
  }
}
