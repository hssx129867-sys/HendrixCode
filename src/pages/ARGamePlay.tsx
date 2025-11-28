import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CockpitContainer, CockpitPanel, CockpitPanelBody, CockpitButton } from '../design-system';
import { ARGameWrapper } from '../components/ar/ARGameWrapper';
import './ARGamePlay.css';

export const ARGamePlay = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  const handleExit = () => {
    navigate('/ar-game');
  };

  const handleError = (errorMessage: string) => {
    console.error('AR Game Error:', errorMessage);
    setError(errorMessage);
    
    // Check if it's a support error
    if (errorMessage.includes('not supported') || errorMessage.includes('NOT_SUPPORTED')) {
      setIsSupported(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsSupported(null);
    window.location.reload();
  };

  // Show error/fallback UI
  if (error || isSupported === false) {
    return (
      <div className="ar-game-play ar-game-play--error">
        <CockpitContainer size="md">
          <CockpitPanel variant="outlined" className="ar-game-error">
            <CockpitPanelBody>
              <div className="ar-error-content">
                <h2 className="ar-error-title">⚠️ AR SESSION ERROR</h2>
                <p className="ar-error-message">{error || 'AR is not supported on this device or browser.'}</p>
                
                <div className="ar-error-suggestions">
                  <h3>SYSTEM REQUIREMENTS</h3>
                  <ul>
                    <li>📱 AR-capable device (iPad, iPhone, or Android with ARCore)</li>
                    <li>🌐 WebXR-compatible browser (Chrome, Edge, or Safari)</li>
                    <li>🔒 HTTPS connection (automatic on Vercel deployment)</li>
                    <li>📷 Camera permissions granted</li>
                  </ul>
                  
                  <h3>RECOMMENDED HARDWARE</h3>
                  <ul>
                    <li>iPad Pro or iPad Air (iOS 13+)</li>
                    <li>iPhone 6S or newer (iOS 13+)</li>
                    <li>Android phones with ARCore support</li>
                  </ul>
                </div>
                
                <div className="ar-error-actions">
                  <CockpitButton variant="primary" size="large" onClick={handleRetry}>
                    🔄 RETRY AR SESSION
                  </CockpitButton>
                  <CockpitButton size="large" onClick={handleExit}>
                    ← BACK TO BRIEFING
                  </CockpitButton>
                </div>
              </div>
            </CockpitPanelBody>
          </CockpitPanel>
        </CockpitContainer>
      </div>
    );
  }

  // Launch the AR game
  return <ARGameWrapper onExit={handleExit} onError={handleError} />;
};

