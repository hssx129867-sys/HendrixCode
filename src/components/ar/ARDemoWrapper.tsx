import { useEffect, useRef, useState, useCallback } from 'react';
import { MockARDemo, type MockARDemoSession } from './MockARDemo';
import { RealARDemoAdapter } from './RealARDemoAdapter';
import type { CubeData } from './MockARDemo';
import { getARMode, getARAvailabilityMessage, type ARCapabilityResult } from '../../utils/arCapability';
import './ARDemoWrapper.css';

interface ARDemoWrapperProps {
  onExit: () => void;
  onError?: (error: string) => void;
}

export const ARDemoWrapper = ({ onExit, onError }: ARDemoWrapperProps) => {
  const demoRef = useRef<MockARDemoSession | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const [cubes, setCubes] = useState<CubeData[]>([]);
  const [statusMessage, setStatusMessage] = useState('Initializing AR session...');
  const [isReady, setIsReady] = useState(false);
  const [arCapability, setArCapability] = useState<ARCapabilityResult | null>(null);

  // Demo render loop
  const startRenderLoop = useCallback(() => {
    const loop = (time: number) => {
      if (!demoRef.current) return;

      const deltaTime = lastTimeRef.current === 0 ? 0 : (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Update demo
      demoRef.current.update(deltaTime);

      // Update UI from demo state
      setCubes(demoRef.current.getCubes());

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
  }, []);

  // Initialize the AR demo
  useEffect(() => {
    let mounted = true;

    const initDemo = async () => {
      try {
        // Check AR capability first
        const capability = await getARMode();
        if (mounted) {
          setArCapability(capability);
        }

        console.log(`Creating ${capability.mode === 'real' ? 'Real' : 'Mock'} AR Demo instance...`);
        
        let demo: MockARDemoSession;
        if (capability.mode === 'real') {
          demo = new RealARDemoAdapter();
        } else {
          demo = new MockARDemo();
        }
        demoRef.current = demo;

        console.log('Initializing AR session...');
        await demo.initialize();

        if (!mounted) {
          demo.stop();
          return;
        }

        console.log('Starting AR demo...');
        await demo.start();

        if (!mounted) {
          demo.stop();
          return;
        }

        setIsReady(true);
        setStatusMessage('Tap anywhere to place colorful cubes!');

        // Start the render loop
        startRenderLoop();
      } catch (error) {
        console.error('Failed to initialize AR demo:', error);
        const errorMsg = error instanceof Error ? error.message : 'Failed to start AR session';
        setStatusMessage(errorMsg);
        onError?.(errorMsg);
      }
    };

    initDemo();

    return () => {
      mounted = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (demoRef.current) {
        demoRef.current.stop();
      }
    };
  }, [onError, startRenderLoop]);

  // Handle tap to place cube
  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (!demoRef.current || !isReady) return;

    const rect = e.currentTarget.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      // Touch event
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return;
      }
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    demoRef.current.placeCube(x, y);
  };

  // Handle clear cubes
  const handleClear = () => {
    if (demoRef.current) {
      demoRef.current.clearCubes();
      setCubes([]);
    }
  };

  // Handle exit
  const handleExit = () => {
    onExit();
  };

  return (
    <div className="ar-demo-wrapper">
      {/* AR Viewport - This is where the AR rendering happens */}
      <div 
        className="ar-demo-viewport" 
        id="ar-demo-viewport"
        onClick={handleTap}
        onTouchStart={handleTap}
      >
        {/* Mock AR Scene with placed cubes */}
        <div className="ar-demo-scene">
          <div className="ar-demo-message">
            <h3>🎲 AR Cube Placement Demo</h3>
            {arCapability && (
              <p className="ar-capability-badge">
                {getARAvailabilityMessage(arCapability)}
              </p>
            )}
            <p>This demonstrates basic AR object placement.</p>
            <p className="ar-demo-note">
              {arCapability?.mode === 'mock' ? (
                <>
                  Running in simulator mode.<br/>
                  Tap anywhere to place colorful cubes.
                </>
              ) : (
                <>
                  Full WebXR integration coming soon!<br/>
                  Tap anywhere to place colorful cubes.
                </>
              )}
            </p>
          </div>
          
          {/* Render placed cubes */}
          {cubes.map((cube) => (
            <div
              key={cube.id}
              className="ar-demo-cube"
              style={{
                left: `${(cube.x + 1) * 50}%`,
                top: `${(cube.y + 1) * 50}%`,
                backgroundColor: cube.color,
              }}
            />
          ))}
        </div>
      </div>

      {/* HUD Overlay */}
      <div className="ar-demo-hud">
        {/* Top Bar */}
        <div className="ar-demo-hud-top">
          <button
            className="ar-demo-button ar-demo-button--exit"
            onClick={handleExit}
            title="Exit AR Demo"
          >
            ✕
          </button>

          <div className="ar-demo-title">AR DEMO</div>

          {cubes.length > 0 && (
            <button
              className="ar-demo-button ar-demo-button--clear"
              onClick={handleClear}
              title="Clear all cubes"
            >
              🗑️
            </button>
          )}
        </div>

        {/* Center Status Message */}
        <div className="ar-demo-hud-center">
          <div className="ar-demo-status">
            <div className="ar-demo-status__icon">
              {isReady ? '🎲' : '⏳'}
            </div>
            <div className="ar-demo-status__message">{statusMessage}</div>
            {cubes.length > 0 && (
              <div className="ar-demo-status__count">
                Cubes placed: {cubes.length} / {20 /* MAX_CUBES from MockARDemo */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
