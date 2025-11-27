import { useState } from 'react';
import { StatusMessage, Button } from '../components/ui';
import './ARDemoPlay.css';

export const ARDemoPlay = () => {
  const [error] = useState<string | null>(
    'AR demo integration in progress. This feature will connect to the PlaceCubeDemo.'
  );

  const handleExit = () => {
    window.history.back();
  };

  // For now, show a coming soon message
  // TODO: Integrate with PlaceCubeDemo once TypeScript config is resolved
  if (error) {
    return (
      <div className="ar-demo-play">
        <div className="ar-demo-error">
          <StatusMessage type="info">
            <h3>AR Demo Coming Soon</h3>
            <p>The AR cube placement demo integration is currently being finalized.</p>
            <p>The demo exists at <code>src/samples/ar-demo/PlaceCubeDemo.ts</code></p>
          </StatusMessage>
          <Button variant="primary" size="large" onClick={handleExit}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="ar-demo-play">
      {/* AR viewport */}
      <div className="ar-viewport" id="ar-viewport">
        {/* The AR session will render here */}
      </div>

      {/* Simple HUD */}
      <div className="ar-demo-hud">
        <div className="ar-demo-hud-top">
          <Button
            variant="ghost"
            size="small"
            onClick={handleExit}
            className="ar-exit-button"
          >
            ✕ Exit
          </Button>
          <div className="ar-demo-title">AR Demo</div>
        </div>
      </div>
    </div>
  );
};
