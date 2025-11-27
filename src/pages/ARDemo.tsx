import { useNavigate } from 'react-router-dom';
import { Container, Card, CardBody, Button } from '../components/ui';
import { Header } from '../components/ui/Header';
import './ARDemo.css';

export const ARDemo = () => {
  const navigate = useNavigate();

  const handleLaunchDemo = () => {
    // Navigate to the actual AR demo session
    navigate('/ar-demo/play');
  };

  return (
    <div className="ar-demo-page">
      <Header />
      
      <div className="ar-demo-hero">
        <Container size="md">
          <div className="ar-demo-hero__content">
            <h1 className="ar-demo-hero__title">
              <span className="ar-demo-hero__icon">🎲</span>
              AR Demo: Place Cubes
            </h1>
            <p className="ar-demo-hero__subtitle">
              A simple demonstration of AR plane detection and object placement
            </p>
            <div className="ar-demo-hero__actions">
              <Button
                variant="primary"
                size="large"
                onClick={handleLaunchDemo}
              >
                🚀 Start AR Demo
              </Button>
              <Button
                variant="ghost"
                size="large"
                onClick={() => navigate('/ar-game')}
              >
                Try Full AR Game
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container size="md">
        <section className="ar-demo-section">
          <Card variant="elevated">
            <CardBody>
              <div className="ar-demo-info">
                <h2 className="ar-demo-info__title">What You'll Do</h2>
                <ol className="ar-demo-info__list">
                  <li>
                    <strong>Allow camera access</strong> when your browser prompts you
                  </li>
                  <li>
                    <strong>Move your device slowly</strong> to help it detect flat surfaces
                  </li>
                  <li>
                    <strong>Tap anywhere</strong> on a detected surface to place a colorful cube
                  </li>
                  <li>
                    <strong>Place multiple cubes</strong> to see how AR anchors work in your space
                  </li>
                </ol>
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="ar-demo-section">
          <div className="ar-demo-features">
            <div className="ar-demo-feature">
              <div className="ar-demo-feature__icon">📐</div>
              <h3>Plane Detection</h3>
              <p>Experience how AR detects horizontal surfaces in your environment</p>
            </div>
            <div className="ar-demo-feature">
              <div className="ar-demo-feature__icon">🎯</div>
              <h3>Hit Testing</h3>
              <p>Learn how AR maps screen taps to 3D positions in real space</p>
            </div>
            <div className="ar-demo-feature">
              <div className="ar-demo-feature__icon">⚓</div>
              <h3>Spatial Anchors</h3>
              <p>See how virtual objects stay locked to real-world positions</p>
            </div>
          </div>
        </section>

        <section className="ar-demo-section">
          <div className="ar-demo-cta">
            <h2>Ready to Try?</h2>
            <p>Start placing cubes in augmented reality</p>
            <Button
              variant="primary"
              size="large"
              onClick={handleLaunchDemo}
            >
              🚀 Launch AR Demo
            </Button>
          </div>
        </section>

        <section className="ar-demo-section">
          <Card variant="outlined">
            <CardBody>
              <div className="ar-demo-tips">
                <h3>💡 Tips for Best Results</h3>
                <ul>
                  <li>Use the demo in a well-lit room</li>
                  <li>Look for surfaces with visible texture (not plain white)</li>
                  <li>Move slowly when scanning for surfaces</li>
                  <li>Try landscape orientation on iPad for a wider view</li>
                </ul>
              </div>
            </CardBody>
          </Card>
        </section>
      </Container>
    </div>
  );
};
