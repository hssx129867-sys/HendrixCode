import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusMessage, Button, Container } from '../components/ui';
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

  // Show error/fallback UI
  if (error || isSupported === false) {
    return (
      <div className="ar-game-play ar-game-play--error">
        <Container size="sm">
          <div className="ar-game-error">
            <StatusMessage type="warning">
              <h3>⚠️ AR Not Available</h3>
              <p>{error || 'AR is not supported on this device or browser.'}</p>
              
              <div className="ar-error-suggestions">
                <h4>To use AR Target Drop, you need:</h4>
                <ul>
                  <li>📱 An AR-capable device (iPad, iPhone, or Android with ARCore)</li>
                  <li>🌐 A WebXR-compatible browser (Chrome, Edge, or Safari)</li>
                  <li>🔒 HTTPS connection (automatically provided on Vercel)</li>
                  <li>📷 Camera permissions granted</li>
                </ul>
                
                <h4>Recommended devices:</h4>
                <ul>
                  <li>iPad Pro or iPad Air (iOS 13+)</li>
                  <li>iPhone 6S or newer (iOS 13+)</li>
                  <li>Android phones with ARCore support</li>
                </ul>
              </div>
            </StatusMessage>
            
            <div className="ar-error-actions">
              <Button variant="primary" size="large" onClick={handleExit}>
                ← Back to AR Game Info
              </Button>
              <Button 
                variant="ghost" 
                size="large" 
                onClick={() => window.location.reload()}
              >
                🔄 Try Again
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Launch the AR game
  return <ARGameWrapper onExit={handleExit} onError={handleError} />;
};

