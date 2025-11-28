/**
 * Mock AR Demo Session
 * 
 * This is a simplified demonstration of AR cube placement that works
 * within the React app build constraints. The full AR engine integration
 * at src/samples/ar-demo/PlaceCubeDemo.ts requires resolving TypeScript
 * configuration issues with WebXR types and module resolution.
 * 
 * This mock provides:
 * - AR session simulation
 * - Tap to place cubes
 * - Basic AR interaction demonstration
 */

export interface CubeData {
  id: number;
  x: number;
  y: number;
  color: string;
}

export interface MockARDemoSession {
  initialize(): Promise<void>;
  start(): Promise<void>;
  stop(): void;
  update(deltaTime: number): void;
  placeCube(screenX: number, screenY: number): void;
  getCubes(): CubeData[];
  clearCubes(): void;
}

// Maximum number of cubes that can be placed (FIFO removal)
const MAX_CUBES = 20;

export class MockARDemo implements MockARDemoSession {
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
    console.log('[MockARDemo] Initializing...');
    
    // Simulate initialization delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('[MockARDemo] Checking AR support...');
    
    // Check if WebXR is available
    if ('xr' in navigator && navigator.xr) {
      try {
        const supported = await navigator.xr.isSessionSupported('immersive-ar');
        if (supported) {
          console.log('[MockARDemo] WebXR AR is supported!');
        } else {
          console.log('[MockARDemo] WebXR available but AR not supported');
        }
      } catch (e) {
        console.log('[MockARDemo] WebXR check failed:', e);
      }
    } else {
      console.log('[MockARDemo] WebXR not available - using mock mode');
    }
    
    console.log('[MockARDemo] Initialized successfully');
  }

  async start(): Promise<void> {
    console.log('[MockARDemo] Starting demo...');
    
    // Simulate AR session start
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.isRunning = true;
    
    console.log('[MockARDemo] Demo started - tap to place cubes!');
  }

  stop(): void {
    console.log('[MockARDemo] Stopping demo...');
    this.isRunning = false;
  }

  update(_deltaTime: number): void {
    // Update logic if needed (e.g., animations)
  }

  placeCube(screenX: number, screenY: number): void {
    if (!this.isRunning) return;
    
    // Simulate hit test result - place cube at normalized screen position
    const normalizedX = (screenX / window.innerWidth) * 2 - 1;
    const normalizedY = (screenY / window.innerHeight) * 2 - 1;
    
    // Pick a random color
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    
    const cube: CubeData = {
      id: this.nextCubeId++,
      x: normalizedX,
      y: normalizedY,
      color,
    };
    
    this.cubes.push(cube);
    console.log(`[MockARDemo] Placed cube #${cube.id} at (${normalizedX.toFixed(2)}, ${normalizedY.toFixed(2)})`);
    
    // Limit to MAX_CUBES with FIFO removal
    if (this.cubes.length > MAX_CUBES) {
      const removed = this.cubes.shift();
      console.log(`[MockARDemo] Removed oldest cube #${removed?.id}`);
    }
  }

  getCubes(): CubeData[] {
    return [...this.cubes];
  }

  clearCubes(): void {
    console.log('[MockARDemo] Clearing all cubes');
    this.cubes = [];
  }
}
