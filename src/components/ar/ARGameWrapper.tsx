import { useEffect, useRef, useState, useCallback } from 'react';
import { MockARGame } from './MockARGame';
import './ARGameWrapper.css';

export type ARGameState = 'initializing' | 'placing' | 'playing' | 'paused' | 'game_over';

interface ARGameWrapperProps {
  onExit: () => void;
  onError?: (error: string) => void;
}

export const ARGameWrapper = ({ onExit, onError }: ARGameWrapperProps) => {
  const gameRef = useRef<MockARGame | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const [gameState, setGameState] = useState<ARGameState>('initializing');
  const [score, setScore] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing AR session...');
  const [showControls, setShowControls] = useState(true);

  // Initialize the AR game
  useEffect(() => {
    let mounted = true;

    const initGame = async () => {
      try {
        console.log('Creating Mock AR Game instance...');
        
        const game = new MockARGame();
        gameRef.current = game;

        console.log('Initializing AR session...');
        await game.initialize();

        if (!mounted) {
          game.stop();
          return;
        }

        console.log('Starting AR game...');
        await game.start();

        if (!mounted) {
          game.stop();
          return;
        }

        setGameState('placing');
        setStatusMessage('Move your device to scan for surfaces...');

        // Start the render loop
        startRenderLoop();
      } catch (error) {
        console.error('Failed to initialize AR game:', error);
        const errorMsg = error instanceof Error ? error.message : 'Failed to start AR session';
        setStatusMessage(errorMsg);
        onError?.(errorMsg);
      }
    };

    initGame();

    return () => {
      mounted = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (gameRef.current) {
        gameRef.current.stop();
      }
    };
  }, [onError]);

  // Game render loop
  const startRenderLoop = useCallback(() => {
    const loop = (time: number) => {
      if (!gameRef.current) return;

      const deltaTime = lastTimeRef.current === 0 ? 0 : (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Update game
      gameRef.current.update(deltaTime);

      // Update UI from game state
      const state = gameRef.current.getGameState();
      const currentScore = gameRef.current.getScore();

      setGameState(state.currentState as ARGameState);
      setScore(currentScore);

      // Update status messages based on state
      switch (state.currentState) {
        case 'placing':
          setStatusMessage('Tap on a detected surface to place your spawn pad');
          break;
        case 'playing':
          setStatusMessage('Tap targets to score points!');
          break;
        case 'paused':
          setStatusMessage('Game Paused');
          break;
        case 'game_over':
          setStatusMessage(`Game Over! Final Score: ${currentScore}`);
          break;
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
  }, []);

  // Handle pause/resume
  const handlePause = () => {
    if (gameRef.current && gameState === 'playing') {
      gameRef.current.pause();
      setGameState('paused');
    }
  };

  const handleResume = () => {
    if (gameRef.current && gameState === 'paused') {
      gameRef.current.resume();
      setGameState('playing');
    }
  };

  // Handle restart
  const handleRestart = async () => {
    if (gameRef.current) {
      setGameState('initializing');
      setStatusMessage('Restarting game...');
      setScore(0);
      await gameRef.current.restart();
      setGameState('placing');
      setStatusMessage('Tap on a detected surface to place your spawn pad');
    }
  };

  // Handle exit with confirmation
  const handleExit = () => {
    if (gameState === 'playing' || gameState === 'paused') {
      if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
        onExit();
      }
    } else {
      onExit();
    }
  };

  // Toggle controls visibility
  const handleToggleControls = () => {
    setShowControls(!showControls);
  };

  return (
    <div className="ar-game-wrapper">
      {/* AR Viewport - This is where the AR rendering happens */}
      <div className="ar-viewport" id="ar-viewport">
        {/* AR session renders here via WebGL canvas */}
        <div className="ar-mock-scene">
          <div className="ar-mock-message">
            <h3>🎮 AR Target Drop Demo</h3>
            <p>This is a demonstration of the cockpit UI and game flow.</p>
            <p className="ar-mock-note">
              Full WebXR integration coming soon!<br/>
              The game will automatically place a spawn pad and begin scoring.
            </p>
          </div>
        </div>
      </div>

      {/* HUD Overlay */}
      <div className={`ar-hud ${!showControls ? 'ar-hud--minimal' : ''}`}>
        {/* Top Bar */}
        <div className="ar-hud-top">
          <button
            className="ar-hud-button ar-hud-button--exit"
            onClick={handleExit}
            title="Exit AR Game"
          >
            ✕
          </button>

          {showControls && (
            <>
              <div className="ar-hud-score">
                <span className="ar-hud-score__label">SCORE</span>
                <span className="ar-hud-score__value">{score}</span>
              </div>

              <button
                className="ar-hud-button ar-hud-button--minimize"
                onClick={handleToggleControls}
                title="Minimize Controls"
              >
                ▼
              </button>
            </>
          )}

          {!showControls && (
            <button
              className="ar-hud-button ar-hud-button--expand"
              onClick={handleToggleControls}
              title="Show Controls"
            >
              ▲
            </button>
          )}
        </div>

        {/* Center Status Message */}
        {showControls && (
          <div className="ar-hud-center">
            <div className="ar-hud-status">
              <div className="ar-hud-status__icon">
                {gameState === 'initializing' && '⏳'}
                {gameState === 'placing' && '🎯'}
                {gameState === 'playing' && '🎮'}
                {gameState === 'paused' && '⏸️'}
                {gameState === 'game_over' && '🏁'}
              </div>
              <div className="ar-hud-status__message">{statusMessage}</div>
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        {showControls && (
          <div className="ar-hud-bottom">
            {gameState === 'playing' && (
              <button
                className="ar-hud-button ar-hud-button--control"
                onClick={handlePause}
              >
                ⏸️ Pause
              </button>
            )}

            {gameState === 'paused' && (
              <>
                <button
                  className="ar-hud-button ar-hud-button--control"
                  onClick={handleResume}
                >
                  ▶️ Resume
                </button>
                <button
                  className="ar-hud-button ar-hud-button--control"
                  onClick={handleRestart}
                >
                  🔄 Restart
                </button>
              </>
            )}

            {gameState === 'game_over' && (
              <button
                className="ar-hud-button ar-hud-button--control ar-hud-button--primary"
                onClick={handleRestart}
              >
                🔄 Play Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
