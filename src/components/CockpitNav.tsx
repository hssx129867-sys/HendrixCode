import { useNavigate, useLocation } from 'react-router-dom';
import { CockpitButton } from '../design-system';
import './CockpitNav.css';

export const CockpitNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Don't show nav during active AR sessions
  const isInARSession = location.pathname === '/ar-game/play' || location.pathname === '/ar-demo/play';
  
  if (isInARSession) {
    return null;
  }

  return (
    <nav className="cockpit-nav">
      <div className="cockpit-nav__container">
        <button 
          className="cockpit-nav__logo"
          onClick={() => navigate('/')}
        >
          <span className="cockpit-nav__logo-icon">🚀</span>
          <span className="cockpit-nav__logo-text">BEST BOYS LAB</span>
        </button>

        <div className="cockpit-nav__links">
          <CockpitButton
            size="small"
            variant={isActive('/') && location.pathname === '/' ? 'primary' : 'default'}
            onClick={() => navigate('/')}
          >
            HOME
          </CockpitButton>
          
          <CockpitButton
            size="small"
            variant={isActive('/ar-game') || isActive('/ar-demo') ? 'primary' : 'default'}
            onClick={() => navigate('/ar-game')}
          >
            🎯 AR COCKPIT
          </CockpitButton>
          
          <CockpitButton
            size="small"
            variant={isActive('/players') || isActive('/play') || isActive('/game') ? 'primary' : 'default'}
            onClick={() => navigate('/players')}
          >
            🎮 GAMES
          </CockpitButton>
          
          <CockpitButton
            size="small"
            variant={isActive('/christmas-lab') ? 'primary' : 'default'}
            onClick={() => navigate('/christmas-lab')}
          >
            🎄 CHRISTMAS
          </CockpitButton>
        </div>
      </div>
    </nav>
  );
};
