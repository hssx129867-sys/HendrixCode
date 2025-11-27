import {
  IARSession,
  IARFrame,
  IARCamera,
  IARPlane,
  IARHitTestResult,
  IARAnchor,
  ARTrackingState,
  ARPlaneType,
  ARSessionConfig,
  ARSessionError,
} from '../ARInterfaces';
import { Matrix4 } from '../../core/math/Matrix4';
import { Vector3 } from '../../core/math/Vector3';
import { Vector2 } from '../../core/math/Vector2';
import { Quaternion } from '../../core/math/Quaternion';

/**
 * WebXR implementation of AR session.
 */
export class WebXRSession implements IARSession {
  private xrSession: XRSession | null = null;
  private xrRefSpace: XRReferenceSpace | null = null;
  private currentFrame: IARFrame | null = null;
  private hitTestSource: XRHitTestSource | null = null;
  private anchors: Map<string, IARAnchor> = new Map();
  private config: ARSessionConfig;
  private animationFrameId: number | null = null;

  constructor(config: ARSessionConfig = {}) {
    this.config = {
      planeDetection: true,
      lightEstimation: false,
      depthSensing: false,
      cameraFacing: 'back',
      ...config,
    };
  }

  /**
   * Checks if WebXR AR is supported.
   */
  async isSupported(): Promise<boolean> {
    if (!navigator.xr) {
      return false;
    }

    try {
      return await navigator.xr.isSessionSupported('immersive-ar');
    } catch (error) {
      console.error('WebXR support check failed:', error);
      return false;
    }
  }

  /**
   * Starts the WebXR AR session.
   */
  async start(): Promise<void> {
    if (!(await this.isSupported())) {
      throw new ARSessionError(
        'WebXR AR is not supported on this device',
        'NOT_SUPPORTED',
        'WebXR'
      );
    }

    try {
      // Request AR session with required features
      const sessionInit: XRSessionInit = {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay', 'light-estimation', 'anchors'],
      };

      this.xrSession = await navigator.xr!.requestSession('immersive-ar', sessionInit);

      // Set up reference space
      this.xrRefSpace = await this.xrSession.requestReferenceSpace('local');

      // Set up hit test source
      if (this.config.planeDetection) {
        const viewerSpace = await this.xrSession.requestReferenceSpace('viewer');
        this.hitTestSource = await this.xrSession.requestHitTestSource({
          space: viewerSpace,
        });
      }

      // Handle session end
      this.xrSession.addEventListener('end', () => {
        this.stop();
      });

    } catch (error) {
      throw new ARSessionError(
        `Failed to start WebXR session: ${error}`,
        'START_FAILED',
        'WebXR'
      );
    }
  }

  /**
   * Stops the WebXR AR session.
   */
  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.hitTestSource) {
      this.hitTestSource.cancel();
      this.hitTestSource = null;
    }

    if (this.xrSession) {
      this.xrSession.end();
      this.xrSession = null;
    }

    this.xrRefSpace = null;
    this.currentFrame = null;
    this.anchors.clear();
  }

  /**
   * Updates the AR session (called every frame).
   */
  update(): void {
    // WebXR update happens in the animation frame callback
    // This is called by the game loop but actual updates happen via requestAnimationFrame
  }

  /**
   * Starts the WebXR render loop.
   */
  startRenderLoop(onFrame: (frame: IARFrame) => void): void {
    if (!this.xrSession || !this.xrRefSpace) return;

    const session = this.xrSession;
    const refSpace = this.xrRefSpace;

    const renderLoop = (time: number, xrFrame: XRFrame): void => {
      if (!session || !refSpace) return;

      this.animationFrameId = session.requestAnimationFrame(renderLoop);

      // Get viewer pose
      const pose = xrFrame.getViewerPose(refSpace);
      if (!pose) return;

      // Build AR frame data
      this.currentFrame = this.buildARFrame(xrFrame, pose);

      // Call user callback
      onFrame(this.currentFrame);
    };

    this.animationFrameId = session.requestAnimationFrame(renderLoop);
  }

  /**
   * Builds an IARFrame from WebXR data.
   */
  private buildARFrame(xrFrame: XRFrame, pose: XRViewerPose): IARFrame {
    const view = pose.views[0]; // Use first view (mono/left eye)
    
    // Convert XR transform to Matrix4
    const transform = this.xrTransformToMatrix4(pose.transform);
    const projectionMatrix = this.xrMatrix4ToMatrix4(view.projectionMatrix);

    const camera: IARCamera = {
      transform,
      projectionMatrix,
      trackingState: ARTrackingState.NORMAL,
    };

    // Get planes from hit test results (WebXR doesn't directly expose planes)
    const planes: IARPlane[] = this.detectPlanesFromHitTests(xrFrame);

    return {
      timestamp: xrFrame.predictedDisplayTime,
      camera,
      planes,
    };
  }

  /**
   * Attempts to detect planes from hit test results.
   */
  private detectPlanesFromHitTests(xrFrame: XRFrame): IARPlane[] {
    // WebXR doesn't directly expose detected planes like ARKit/ARCore
    // This is a simplified approximation
    return [];
  }

  /**
   * Gets the current AR frame.
   */
  getCurrentFrame(): IARFrame | null {
    return this.currentFrame;
  }

  /**
   * Performs a hit test to find surfaces.
   */
  async hitTest(screenX: number, screenY: number): Promise<IARHitTestResult[]> {
    if (!this.xrSession || !this.xrRefSpace || !this.hitTestSource) {
      return [];
    }

    // This is a simplified implementation
    // In a real app, you'd convert screen coords to XR space
    return [];
  }

  /**
   * Performs hit test using the viewer's gaze.
   */
  async hitTestFromViewer(xrFrame: XRFrame): Promise<IARHitTestResult[]> {
    if (!this.hitTestSource || !this.xrRefSpace) {
      return [];
    }

    const hitTestResults = xrFrame.getHitTestResults(this.hitTestSource);
    const results: IARHitTestResult[] = [];

    for (const hitTest of hitTestResults) {
      const pose = hitTest.getPose(this.xrRefSpace);
      if (!pose) continue;

      const transform = this.xrTransformToMatrix4(pose.transform);
      const decomposed = transform.decompose();

      results.push({
        position: decomposed.position,
        rotation: decomposed.rotation,
        distance: decomposed.position.length(),
      });
    }

    return results;
  }

  /**
   * Creates an anchor at a specific position.
   */
  async createAnchor(position: Vector3, rotation: Quaternion): Promise<IARAnchor | null> {
    if (!this.xrSession || !this.xrRefSpace) {
      return null;
    }

    try {
      // Create XRRigidTransform from position and rotation
      const matrix = new Matrix4().compose(position, rotation, new Vector3(1, 1, 1));
      const xrTransform = this.matrix4ToXRTransform(matrix);

      if (!this.xrSession.createAnchor) {
        console.warn('WebXR anchors not supported');
        return null;
      }

      const xrAnchor = await this.xrSession.createAnchor(xrTransform, this.xrRefSpace);
      if (!xrAnchor) return null;

      const anchorId = `anchor_${Date.now()}_${Math.random()}`;
      const anchor: IARAnchor = {
        id: anchorId,
        transform: matrix,
        tracking: true,
        createdAt: Date.now(),
      };

      this.anchors.set(anchorId, anchor);
      return anchor;
    } catch (error) {
      console.error('Failed to create anchor:', error);
      return null;
    }
  }

  /**
   * Removes an anchor.
   */
  removeAnchor(anchorId: string): void {
    this.anchors.delete(anchorId);
  }

  /**
   * Gets all active anchors.
   */
  getAnchors(): IARAnchor[] {
    return Array.from(this.anchors.values());
  }

  /**
   * Converts XRRigidTransform to Matrix4.
   */
  private xrTransformToMatrix4(xrTransform: XRRigidTransform): Matrix4 {
    const matrix = new Matrix4();
    const pos = xrTransform.position;
    const rot = xrTransform.orientation;

    const position = new Vector3(pos.x, pos.y, pos.z);
    const rotation = new Quaternion(rot.x, rot.y, rot.z, rot.w);
    const scale = new Vector3(1, 1, 1);

    matrix.compose(position, rotation, scale);
    return matrix;
  }

  /**
   * Converts Float32Array to Matrix4.
   */
  private xrMatrix4ToMatrix4(arr: Float32Array): Matrix4 {
    const matrix = new Matrix4();
    matrix.elements.set(arr);
    return matrix;
  }

  /**
   * Converts Matrix4 to XRRigidTransform.
   */
  private matrix4ToXRTransform(matrix: Matrix4): XRRigidTransform {
    const decomposed = matrix.decompose();
    const pos = decomposed.position;
    const rot = decomposed.rotation;

    return new XRRigidTransform(
      { x: pos.x, y: pos.y, z: pos.z, w: 1 },
      { x: rot.x, y: rot.y, z: rot.z, w: rot.w }
    );
  }
}
