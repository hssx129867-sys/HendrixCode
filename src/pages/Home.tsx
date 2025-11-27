import { useNavigate } from 'react-router-dom';
import { getPlayers, getDaysUntilChristmas } from '../utils/storage';
import { Avatar } from '../components/Avatar';
import { CockpitButton, CockpitPanel, CockpitPanelBody, CockpitContainer } from '../design-system';
import './Home.css';

export const Home = () => {
  const navigate = useNavigate();
  const players = getPlayers();
  const daysUntilChristmas = getDaysUntilChristmas();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="home-hero">
        <CockpitContainer size="lg">
          <div className="home-hero__content">
            <h1 className="home-hero__title">
              <span className="home-hero__icon">🚀</span>
              BEST BOYS LAB
              <span className="home-hero__icon">🎮</span>
            </h1>
            <p className="home-hero__subtitle">
              FRONTIER TECH • GAMES & EXPLORATION • AR EXPERIENCES
            </p>
          </div>
        </CockpitContainer>
      </div>

      {/* Main Content */}
      <CockpitContainer size="xl">
        <div className="home-sections">
          {/* AR Games - Primary Feature */}
          <CockpitPanel variant="elevated" glow pulse className="home-section home-section--primary">
            <CockpitPanelBody>
              <div className="section-header">
                <span className="section-icon">🎯</span>
                <h2 className="section-title">AR COCKPIT</h2>
                <span className="section-badge">PRIMARY MISSION</span>
              </div>
              <p className="section-description">
                Step into the frontier. Experience augmented reality gaming with cutting-edge technology.
              </p>
              <div className="section-features">
                <span className="feature">🎯 AR TARGET DROP</span>
                <span className="feature">🌐 WEBXR POWERED</span>
                <span className="feature">📱 IPAD OPTIMIZED</span>
              </div>
              <div className="section-actions">
                <CockpitButton variant="primary" size="large" onClick={() => navigate('/ar-game')}>
                  🚀 LAUNCH AR COCKPIT
                </CockpitButton>
                <CockpitButton size="large" onClick={() => navigate('/ar-demo')}>
                  🎲 TRY AR DEMO
                </CockpitButton>
              </div>
            </CockpitPanelBody>
          </CockpitPanel>

          {/* Game Zone */}
          <CockpitPanel variant="outlined" className="home-section">
            <CockpitPanelBody>
              <div className="section-header">
                <span className="section-icon">🎮</span>
                <h2 className="section-title">GAME ZONE</h2>
              </div>
              <p className="section-description">
                Classic logic games, puzzles, and challenges. Earn stars and track progress.
              </p>
              <div className="section-features">
                <span className="feature">🎨 PATTERN BUILDER</span>
                <span className="feature">🐛 BUG SQUASH</span>
                <span className="feature">🧭 LOGIC PATH</span>
              </div>
              <div className="section-actions">
                <CockpitButton size="large" onClick={() => navigate('/players')}>
                  🎯 START PLAYING
                </CockpitButton>
              </div>
            </CockpitPanelBody>
          </CockpitPanel>

          {/* Christmas Lab */}
          <CockpitPanel variant="outlined" className="home-section">
            <CockpitPanelBody>
              <div className="section-header">
                <span className="section-icon">🎄</span>
                <h2 className="section-title">CHRISTMAS LAB</h2>
              </div>
              <p className="section-description">
                Holiday tools and festive fun. Track Santa, make lists, and find elves.
              </p>
              <div className="christmas-countdown">
                <span className="countdown-days">{daysUntilChristmas}</span>
                <span className="countdown-label">DAYS TO MISSION</span>
              </div>
              <div className="section-features">
                <span className="feature">🎁 WISH LIST</span>
                <span className="feature">🎅 SANTA TRACKER</span>
                <span className="feature">❄️ ELF HUNT</span>
              </div>
              <div className="section-actions">
                <CockpitButton size="large" onClick={() => navigate('/christmas-lab')}>
                  🎄 ENTER LAB
                </CockpitButton>
              </div>
            </CockpitPanelBody>
          </CockpitPanel>
        </div>

        {/* Pilots Section */}
        {players.length > 0 && (
          <div className="home-pilots">
            <h2 className="pilots-title">REGISTERED PILOTS</h2>
            <div className="pilots-grid">
              {players.map((player) => (
                <CockpitPanel key={player.id} variant="outlined" className="pilot-card">
                  <CockpitPanelBody>
                    <Avatar type={player.avatarType} size="large" />
                    <p className="pilot-name">{player.name.toUpperCase()}</p>
                  </CockpitPanelBody>
                </CockpitPanel>
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="home-footer">
          <p className="home-footer__text">
            BEST BOYS LAB • FRONTIER DIVISION • ALL SYSTEMS OPERATIONAL
          </p>
        </div>
      </CockpitContainer>
    </div>
  );
};
