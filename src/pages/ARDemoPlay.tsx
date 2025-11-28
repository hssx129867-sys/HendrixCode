import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusMessage, Button, Container } from '../components/ui';
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

  // Show error/fallback UI
  if (error || isSupported === false) {
    return (
      <div className="ar-demo-play ar-demo-play--error">
        <Container size="sm">
          <div className="ar-demo-error">
            <StatusMessage type="warning">
              <h3>⚠️ AR Not Available</h3>
              <p>{error || 'AR is not supported on this device or browser.'}</p>
              
              <div className="ar-error-suggestions">
                <h4>To use AR Demo, you need:</h4>
                <ul>
                  <li>📱 An AR-capable device (iPad, iPhone, or Android with ARCore)</li>
                  <li>🌐 A WebXR-compatible browser (Chrome, Edge, or Safari)</li>
                  <li>🔒 HTTPS connection (automatically provided on Vercel)</li>
                  <li>📷 Camera permissions granted</li>
                </ul>
              </div>
            </StatusMessage>
            
            <div className="ar-error-actions">
              <Button variant="primary" size="large" onClick={handleExit}>
                ← Back to AR Demo Info
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

  // Launch the AR demo
  return <ARDemoWrapper onExit={handleExit} onError={handleError} />;
};
