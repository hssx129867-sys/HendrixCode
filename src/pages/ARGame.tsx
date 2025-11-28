import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CockpitContainer, CockpitPanel, CockpitPanelBody, CockpitButton } from '../design-system';
import './ARGame.css';

export const ARGame = () => {
  const navigate = useNavigate();
  const [showRequirements, setShowRequirements] = useState(false);

  const features = [
    {
      icon: '🎯',
      title: 'AR PLANE DETECTION',
      description: 'Automatically detects flat surfaces in your environment',
    },
    {
      icon: '📊',
      title: 'SCORE TRACKING',
      description: 'Earn points by tapping targets quickly and accurately',
    },
    {
      icon: '👆',
      title: 'TAP TO HIT',
      description: 'Simple tap controls optimized for touch screens',
    },
    {
      icon: '🎮',
      title: 'REAL-TIME GAMEPLAY',
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
      <div className="ar-game-hero">
        <CockpitContainer size="lg">
          <div className="ar-game-hero__content">
            <h1 className="ar-game-hero__title">
              <span className="ar-game-hero__icon">🎯</span>
              AR TARGET DROP
            </h1>
            <p className="ar-game-hero__subtitle">
              FRONTIER TECH • COCKPIT HUD • AUGMENTED REALITY COMBAT
            </p>
            <div className="ar-game-hero__actions">
              <CockpitButton
                variant="primary"
                size="large"
                onClick={handleLaunchGame}
              >
                🚀 LAUNCH AR COCKPIT
              </CockpitButton>
              <CockpitButton
                size="large"
                onClick={() => navigate('/ar-demo')}
              >
                🎲 TRY AR DEMO
              </CockpitButton>
            </div>
          </div>
        </CockpitContainer>
      </div>

      <CockpitContainer size="lg">
        <section className="ar-game-section">
          <h2 className="ar-game-section__title">COCKPIT FEATURES</h2>
          <div className="ar-game-features">
            {features.map((feature, index) => (
              <CockpitPanel key={index} variant="outlined" className="ar-feature-card">
                <CockpitPanelBody>
                  <div className="ar-game-feature">
                    <div className="ar-game-feature__icon">{feature.icon}</div>
                    <h3 className="ar-game-feature__title">{feature.title}</h3>
                    <p className="ar-game-feature__description">
                      {feature.description}
                    </p>
                  </div>
                </CockpitPanelBody>
              </CockpitPanel>
            ))}
          </div>
        </section>

        <section className="ar-game-section">
          <h2 className="ar-game-section__title">MISSION BRIEFING</h2>
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
          <CockpitPanel variant="outlined" className="ar-requirements-card">
            <CockpitPanelBody>
              <div className="ar-game-requirements">
                <h3 className="ar-game-requirements__title">
                  <span>📋</span> SYSTEM REQUIREMENTS
                  <CockpitButton
                    size="small"
                    onClick={() => setShowRequirements(!showRequirements)}
                  >
                    {showRequirements ? '▲' : '▼'}
                  </CockpitButton>
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
            </CockpitPanelBody>
          </CockpitPanel>
        </section>

        <section className="ar-game-section">
          <CockpitPanel variant="elevated" glow pulse className="ar-game-cta">
            <CockpitPanelBody>
              <h2>READY FOR LAUNCH?</h2>
              <p>Enter the frontier of augmented reality gaming</p>
              <CockpitButton
                variant="primary"
                size="large"
                onClick={handleLaunchGame}
              >
                🚀 LAUNCH AR COCKPIT NOW
              </CockpitButton>
            </CockpitPanelBody>
          </CockpitPanel>
        </section>

        <div className="ar-game-footer">
          <CockpitButton onClick={() => navigate('/')}>
            ← BACK TO MAIN
          </CockpitButton>
        </div>
      </CockpitContainer>
    </div>
  );
};
