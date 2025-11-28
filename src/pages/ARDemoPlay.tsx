import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CockpitContainer, CockpitPanel, CockpitPanelBody, CockpitButton } from '../design-system';
import { ARDemoWrapper } from '../components/ar/ARDemoWrapper';
import './ARDemoPlay.css';

export const ARDemoPlay = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  const handleExit = () => {
    navigate('/ar-demo');
  };

  const handleError = (errorMessage: string) => {
    console.error('AR Demo Error:', errorMessage);
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
      <div className="ar-demo-play ar-demo-play--error">
        <CockpitContainer size="md">
          <CockpitPanel variant="outlined" className="ar-demo-error">
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
                </div>
                
                <div className="ar-error-actions">
                  <CockpitButton variant="primary" size="large" onClick={handleRetry}>
                    🔄 RETRY AR SESSION
                  </CockpitButton>
                  <CockpitButton size="large" onClick={handleExit}>
                    ← BACK TO LAB
                  </CockpitButton>
                </div>
              </div>
            </CockpitPanelBody>
          </CockpitPanel>
        </CockpitContainer>
      </div>
    );
  }

  // Launch the AR demo
  return <ARDemoWrapper onExit={handleExit} onError={handleError} />;
};
