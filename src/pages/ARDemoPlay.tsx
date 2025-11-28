import { useNavigate } from 'react-router-dom';
import { CockpitContainer, CockpitPanel, CockpitPanelBody, CockpitButton } from '../design-system';
import { ARDemoWrapper } from '../components/ar/ARDemoWrapper';
import { ARSystemRequirements } from '../components/ar/ARSystemRequirements';
import { useARRetry } from '../hooks/useARRetry';
import './ARDemoPlay.css';

export const ARDemoPlay = () => {
  const navigate = useNavigate();
  const { error, isSupported, handleRetry, handleError } = useARRetry();

  const handleExit = () => {
    navigate('/ar-demo');
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
                
                <ARSystemRequirements />
                
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
