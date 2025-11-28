import { useNavigate } from 'react-router-dom';
import { CockpitContainer, CockpitPanel, CockpitPanelBody, CockpitButton } from '../design-system';
import { ARGameWrapper } from '../components/ar/ARGameWrapper';
import { ARSystemRequirements } from '../components/ar/ARSystemRequirements';
import { useARRetry } from '../hooks/useARRetry';
import './ARGamePlay.css';

export const ARGamePlay = () => {
  const navigate = useNavigate();
  const { error, isSupported, handleRetry, handleError } = useARRetry();

  const handleExit = () => {
    navigate('/ar-game');
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
                
                <ARSystemRequirements />
                
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

