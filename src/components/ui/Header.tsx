import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="ui-header">
      <div className="ui-header__container">
        <Link to="/" className="ui-header__logo">
          <span className="ui-header__logo-icon">🎮</span>
          <span className="ui-header__logo-text">Best Boys Lab</span>
        </Link>

        <nav className="ui-header__nav">
          <Link
            to="/play"
            className={`ui-header__link ${isActive('/play') || isActive('/game') ? 'ui-header__link--active' : ''}`}
          >
            Games
          </Link>
          <Link
            to="/ar-game"
            className={`ui-header__link ${isActive('/ar-game') || isActive('/ar-demo') ? 'ui-header__link--active' : ''}`}
          >
            AR Games
          </Link>
          <Link
            to="/christmas-lab"
            className={`ui-header__link ${isActive('/christmas-lab') ? 'ui-header__link--active' : ''}`}
          >
            Christmas Lab
          </Link>
        </nav>
      </div>
    </header>
  );
};
