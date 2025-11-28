import { useNavigate } from 'react-router-dom';
import { CockpitContainer, CockpitPanel, CockpitPanelBody, CockpitButton } from '../design-system';
import './ARDemo.css';

export const ARDemo = () => {
  const navigate = useNavigate();

  const handleLaunchDemo = () => {
    // Navigate to the actual AR demo session
    navigate('/ar-demo/play');
  };

  return (
    <div className="ar-demo-page">
      <div className="ar-demo-hero">
        <CockpitContainer size="lg">
          <div className="ar-demo-hero__content">
            <h1 className="ar-demo-hero__title">
              <span className="ar-demo-hero__icon">🎲</span>
              AR DEMO LAB
            </h1>
            <p className="ar-demo-hero__subtitle">
              BASIC AR OBJECT PLACEMENT • CUBE SPAWNING • SPATIAL ANCHORS
            </p>
            <div className="ar-demo-hero__actions">
              <CockpitButton
                variant="primary"
                size="large"
                onClick={handleLaunchDemo}
              >
                🚀 START AR DEMO
              </CockpitButton>
              <CockpitButton
                size="large"
                onClick={() => navigate('/ar-game')}
              >
                FULL AR GAME →
              </CockpitButton>
            </div>
          </div>
        </CockpitContainer>
      </div>

      <CockpitContainer size="lg">
        <section className="ar-demo-section">
          <CockpitPanel variant="elevated">
            <CockpitPanelBody>
              <div className="ar-demo-info">
                <h2 className="ar-demo-info__title">MISSION BRIEFING</h2>
                <ol className="ar-demo-info__list">
                  <li>
                    <strong>GRANT CAMERA ACCESS</strong> when prompted by browser
                  </li>
                  <li>
                    <strong>SCAN ENVIRONMENT</strong> by moving device slowly to detect surfaces
                  </li>
                  <li>
                    <strong>TAP TO DEPLOY</strong> colorful cubes on detected surfaces
                  </li>
                  <li>
                    <strong>PLACE MULTIPLE OBJECTS</strong> to test spatial anchors
                  </li>
                </ol>
              </div>
            </CockpitPanelBody>
          </CockpitPanel>
        </section>

        <section className="ar-demo-section">
          <h2 className="section-title">DEMO CAPABILITIES</h2>
          <div className="ar-demo-features">
            <CockpitPanel variant="outlined" className="ar-demo-feature">
              <CockpitPanelBody>
                <div className="ar-demo-feature__icon">📐</div>
                <h3>PLANE DETECTION</h3>
                <p>Experience real-time surface detection in your environment</p>
              </CockpitPanelBody>
            </CockpitPanel>
            <CockpitPanel variant="outlined" className="ar-demo-feature">
              <CockpitPanelBody>
                <div className="ar-demo-feature__icon">🎯</div>
                <h3>HIT TESTING</h3>
                <p>Learn how AR maps screen taps to 3D positions</p>
              </CockpitPanelBody>
            </CockpitPanel>
            <CockpitPanel variant="outlined" className="ar-demo-feature">
              <CockpitPanelBody>
                <div className="ar-demo-feature__icon">⚓</div>
                <h3>SPATIAL ANCHORS</h3>
                <p>See virtual objects locked to real-world positions</p>
              </CockpitPanelBody>
            </CockpitPanel>
          </div>
        </section>

        <section className="ar-demo-section">
          <CockpitPanel variant="elevated" glow className="ar-demo-cta">
            <CockpitPanelBody>
              <h2>READY FOR DEPLOYMENT?</h2>
              <p>Launch the AR demo and start placing cubes in your space</p>
              <CockpitButton
                variant="primary"
                size="large"
                onClick={handleLaunchDemo}
              >
                🚀 INITIATE AR DEMO
              </CockpitButton>
            </CockpitPanelBody>
          </CockpitPanel>
        </section>

        <section className="ar-demo-section">
          <CockpitPanel variant="outlined">
            <CockpitPanelBody>
              <div className="ar-demo-tips">
                <h3>💡 OPTIMAL CONDITIONS</h3>
                <ul>
                  <li>Well-lit environment recommended</li>
                  <li>Surfaces with visible texture preferred</li>
                  <li>Slow scanning motion for best detection</li>
                  <li>Landscape orientation optimal for iPad</li>
                </ul>
              </div>
            </CockpitPanelBody>
          </CockpitPanel>
        </section>

        <div className="ar-demo-footer">
          <CockpitButton onClick={() => navigate('/')}>
            ← BACK TO MAIN
          </CockpitButton>
        </div>
      </CockpitContainer>
    </div>
  );
};
