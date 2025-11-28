/**
 * Real AR Demo Adapter
 * 
 * This adapter wraps real WebXR functionality to implement the AR cube placement demo.
 * It implements the same interface as MockARDemo to allow seamless switching between
 * real and mock modes based on device capabilities.
 */

import type { CubeData, MockARDemoSession } from './MockARDemo';

// Maximum number of cubes that can be placed (FIFO removal)
const MAX_CUBES = 20;

export class RealARDemoAdapter implements MockARDemoSession {
  private xrSession: XRSession | null = null;
  private xrRefSpace: XRReferenceSpace | null = null;
  private xrHitTestSource: XRHitTestSource | null = null;
  private animationFrameHandle: number | null = null;
  private isRunning: boolean = false;
  private cubes: CubeData[] = [];
  private nextCubeId: number = 1;
  
  private colors = [
    '#4ecdc4', // Teal
    '#ff6b6b', // Coral
    '#ffe66d', // Yellow
    '#95e1d3', // Mint
    '#f38181', // Pink
    '#aa96da', // Purple
    '#fcbad3', // Light pink
    '#a8e6cf', // Light green
  ];

  async initialize(): Promise<void> {
    console.log('[RealARDemoAdapter] Initializing real AR session...');
    
    if (!('xr' in navigator) || !navigator.xr) {
      throw new Error('WebXR not available');
    }

    const supported = await navigator.xr.isSessionSupported('immersive-ar');
    if (!supported) {
      throw new Error('AR not supported on this device');
    }

    console.log('[RealARDemoAdapter] Initialized successfully');
  }

  async start(): Promise<void> {
    console.log('[RealARDemoAdapter] Starting AR session...');
    
    if (!navigator.xr) {
      throw new Error('WebXR not available');
    }

    try {
      // Request AR session
      this.xrSession = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'local-floor'],
        optionalFeatures: ['dom-overlay', 'dom-overlay-for-handheld-ar'],
        domOverlay: { root: document.body }
      } as XRSessionInit);

      // Get reference space
      this.xrRefSpace = await this.xrSession.requestReferenceSpace('local-floor');

      // Request hit test source
      const viewerSpace = await this.xrSession.requestReferenceSpace('viewer');
      const hitTestSource = await this.xrSession.requestHitTestSource?.({ space: viewerSpace });
      this.xrHitTestSource = hitTestSource || null;

      // Set up session end handler
      this.xrSession.addEventListener('end', () => {
        this.handleSessionEnd();
      });

      this.isRunning = true;

      // Start render loop
      this.startRenderLoop();

      console.log('[RealARDemoAdapter] AR session started');
    } catch (error) {
      console.error('[RealARDemoAdapter] Failed to start session:', error);
      throw error;
    }
  }

  private startRenderLoop(): void {
    if (!this.xrSession) return;

    const renderLoop = (_time: number, frame: XRFrame): void => {
      if (!this.isRunning || !this.xrSession) return;

      // Request next frame
      this.animationFrameHandle = this.xrSession.requestAnimationFrame(renderLoop);

      // Get viewer pose
      const pose = frame.getViewerPose(this.xrRefSpace!);
      if (!pose) return;

      // Process hit test results (for surface detection visualization)
      if (this.xrHitTestSource) {
        const hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
        if (hitTestResults.length > 0) {
          // Surface detected - could be used to show placement indicator
        }
      }

      // Update demo logic
      this.update(0.016); // ~60fps
    };

    this.animationFrameHandle = this.xrSession.requestAnimationFrame(renderLoop);
  }

  update(deltaTime: number): void {
    // Update demo state based on deltaTime
    // This is called from the render loop
    void deltaTime; // Suppress unused warning
  }

  placeCube(screenX: number, screenY: number): void {
    console.log(`[RealARDemoAdapter] Placing cube at screen position (${screenX}, ${screenY})`);
    
    // In a full implementation, we would:
    // 1. Use hit-test API to find surface at this screen position
    // 2. Create an anchor at that position
    // 3. Render a 3D cube at the anchor
    
    // For now, simulate placement with normalized coordinates
    const normalizedX = (screenX / window.innerWidth) * 2 - 1;
    const normalizedY = (screenY / window.innerHeight) * 2 - 1;
    
    const color = this.colors[this.nextCubeId % this.colors.length];
    const cube: CubeData = {
      id: this.nextCubeId++,
      x: normalizedX,
      y: normalizedY,
      color,
    };
    
    this.cubes.push(cube);
    
    // FIFO removal if we exceed MAX_CUBES
    if (this.cubes.length > MAX_CUBES) {
      const removed = this.cubes.shift();
      console.log(`[RealARDemoAdapter] Removed cube ${removed?.id} (max limit reached)`);
    }
    
    console.log(`[RealARDemoAdapter] Placed cube ${cube.id}. Total cubes: ${this.cubes.length}`);
  }

  getCubes(): CubeData[] {
    return [...this.cubes];
  }

  clearCubes(): void {
    console.log('[RealARDemoAdapter] Clearing all cubes');
    this.cubes = [];
  }

  stop(): void {
    console.log('[RealARDemoAdapter] Stopping AR session...');
    this.isRunning = false;
    
    if (this.animationFrameHandle !== null && this.xrSession) {
      this.xrSession.cancelAnimationFrame(this.animationFrameHandle);
      this.animationFrameHandle = null;
    }

    if (this.xrSession) {
      this.xrSession.end().catch((error) => {
        console.error('[RealARDemoAdapter] Error ending session:', error);
      });
    }
  }

  private handleSessionEnd(): void {
    console.log('[RealARDemoAdapter] Session ended');
    this.isRunning = false;
    this.xrSession = null;
    this.xrRefSpace = null;
    this.xrHitTestSource = null;
    this.animationFrameHandle = null;
  }
}
