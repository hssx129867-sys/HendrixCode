import { useState } from 'react';
import { StatusMessage, Button } from '../components/ui';
import './ARGamePlay.css';

type GameState = 'initializing' | 'placing' | 'playing' | 'paused' | 'game_over';

export const ARGamePlay = () => {
  const [gameState] = useState<GameState>('initializing');
  const [score] = useState(0);
  const [error] = useState<string | null>(
    'AR game integration in progress. This feature will connect to the ARTargetDrop game engine.'
  );

  const handleExit = () => {
    window.history.back();
  };

  // For now, show a coming soon message
  // TODO: Integrate with ARTargetDrop once TypeScript config is resolved
  if (error || gameState === 'initializing') {
    return (
      <div className="ar-game-play">
        <div className="ar-game-error">
          <StatusMessage type="info">
            <h3>AR Game Coming Soon</h3>
            <p>The AR Target Drop game integration is currently being finalized.</p>
            <p>The game engine exists at <code>src/samples/ar-mini-game/ARTargetDrop.ts</code></p>
          </StatusMessage>
          <Button variant="primary" size="large" onClick={handleExit}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="ar-game-play">
      {/* AR viewport - this is where the AR rendering happens */}
      <div className="ar-viewport" id="ar-viewport">
        {/* The AR session will render here */}
      </div>

      {/* HUD Overlay */}
      <div className="ar-hud">
        <div className="ar-hud-top">
          <Button
            variant="ghost"
            size="small"
            onClick={handleExit}
            className="ar-exit-button"
          >
            ✕ Exit
          </Button>
          <div className="ar-score">
            <span className="ar-score-label">Score:</span>
            <span className="ar-score-value">{score}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

