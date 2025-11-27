import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Container, Card, CardBody, Button } from '../components/ui';
import { Header } from '../components/ui/Header';
import './ARGame.css';

export const ARGame = () => {
  const navigate = useNavigate();
  const [showRequirements, setShowRequirements] = useState(false);

  const features = [
    {
      icon: '🎯',
      title: 'AR Plane Detection',
      description: 'Automatically detects flat surfaces in your environment',
    },
    {
      icon: '📊',
      title: 'Score Tracking',
      description: 'Earn points by tapping targets quickly and accurately',
    },
    {
      icon: '👆',
      title: 'Tap to Hit',
      description: 'Simple tap controls optimized for touch screens',
    },
    {
      icon: '🎮',
      title: 'Real-time Gameplay',
      description: 'Targets spawn and move in your real-world space',
    },
  ];

  const requirements = [
    { text: 'Camera access required', met: true },
    { text: 'HTTPS connection (automatic on Vercel)', met: true },
    { text: 'WebXR compatible browser or AR-capable device', met: true },
    { text: 'Well-lit environment with flat surfaces', met: true },
  ];

  const howToPlay = [
    {
      step: 1,
      title: 'Allow Camera Access',
      description: 'Grant camera permission when prompted by your browser',
    },
    {
      step: 2,
      title: 'Find a Flat Surface',
      description: 'Move your device around to detect a horizontal plane (floor, table, etc.)',
    },
    {
      step: 3,
      title: 'Place Spawn Pad',
      description: 'Tap on the detected surface to place your target spawn pad',
    },
    {
      step: 4,
      title: 'Tap Targets to Score',
      description: 'Targets will spawn above the pad. Tap them quickly to earn points!',
    },
  ];

  const handleLaunchGame = () => {
    navigate('/ar-game/play');
  };

  return (
    <div className="ar-game-page">
      <Header />
      
      <div className="ar-game-hero">
        <Container size="lg">
          <div className="ar-game-hero__content">
            <h1 className="ar-game-hero__title">
              <span className="ar-game-hero__icon">🎯</span>
              AR Target Drop
            </h1>
            <p className="ar-game-hero__subtitle">
              Step into the cockpit. Experience augmented reality gaming with frontier technology.
            </p>
            <div className="ar-game-hero__actions">
              <Button
                variant="primary"
                size="large"
                onClick={handleLaunchGame}
                className="ar-launch-button"
              >
                🚀 Launch AR Cockpit
              </Button>
              <Button
                variant="ghost"
                size="large"
                onClick={() => navigate('/ar-demo')}
                className="ar-demo-button"
              >
                Try AR Demo
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container size="lg">
        <section className="ar-game-section">
          <h2 className="ar-game-section__title">Cockpit Features</h2>
          <div className="ar-game-features">
            {features.map((feature, index) => (
              <Card key={index} variant="elevated" className="ar-feature-card">
                <CardBody>
                  <div className="ar-game-feature">
                    <div className="ar-game-feature__icon">{feature.icon}</div>
                    <h3 className="ar-game-feature__title">{feature.title}</h3>
                    <p className="ar-game-feature__description">
                      {feature.description}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        <section className="ar-game-section">
          <h2 className="ar-game-section__title">Mission Briefing</h2>
          <div className="ar-game-steps">
            {howToPlay.map((item) => (
              <div key={item.step} className="ar-game-step">
                <div className="ar-game-step__number">{item.step}</div>
                <div className="ar-game-step__content">
                  <h3 className="ar-game-step__title">{item.title}</h3>
                  <p className="ar-game-step__description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ar-game-section">
          <Card variant="outlined" className="ar-requirements-card">
            <CardBody>
              <div className="ar-game-requirements">
                <h3 className="ar-game-requirements__title">
                  <span>📋</span> System Requirements
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setShowRequirements(!showRequirements)}
                  >
                    {showRequirements ? '▲' : '▼'}
                  </Button>
                </h3>
                {showRequirements && (
                  <ul className="ar-game-requirements__list">
                    {requirements.map((req, index) => (
                      <li key={index} className="ar-game-requirement">
                        <span className="ar-game-requirement__icon">
                          {req.met ? '✅' : '⚠️'}
                        </span>
                        <span>{req.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="ar-game-section">
          <div className="ar-game-cta">
            <h2>Ready for Launch?</h2>
            <p>Enter the frontier of augmented reality gaming</p>
            <Button
              variant="primary"
              size="large"
              onClick={handleLaunchGame}
              className="ar-launch-button"
            >
              🚀 Launch AR Cockpit Now
            </Button>
          </div>
        </section>
      </Container>
    </div>
  );
};
