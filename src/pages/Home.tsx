import { useNavigate } from 'react-router-dom';
import { getPlayers, getDaysUntilChristmas } from '../utils/storage';
import { Avatar } from '../components/Avatar';
import './Home.css';

export const Home = () => {
  const navigate = useNavigate();
  const players = getPlayers();
  const daysUntilChristmas = getDaysUntilChristmas();

  return (
    <div className="home-container">
      <h1 className="home-title">🎮 Best Boys Lab 🎄</h1>
      <p className="home-tagline">Games and Christmas tools for awesome kids!</p>

      <div className="sections-container">
        <div className="section-card game-zone">
          <div className="section-header">
            <span className="section-icon">🎮</span>
            <h2>Game Zone</h2>
          </div>
          <p className="section-description">
            Play fun logic games, earn stars, and track your progress!
          </p>
          <div className="section-features">
            <span className="feature">🎨 Pattern Builder</span>
            <span className="feature">🐛 Bug Squash</span>
            <span className="feature">🧭 Logic Path</span>
          </div>
          <button className="btn-primary btn-large" onClick={() => navigate('/players')}>
            🎯 Start Playing
          </button>
        </div>

        <div className="section-card christmas-zone">
          <div className="section-header">
            <span className="section-icon">🎄</span>
            <h2>Christmas Lab</h2>
          </div>
          <p className="section-description">
            Make your Christmas list and use fun holiday tools!
          </p>
          <div className="christmas-countdown">
            <span className="countdown-days">{daysUntilChristmas}</span>
            <span className="countdown-label">days until Christmas!</span>
          </div>
          <div className="section-features">
            <span className="feature">🎁 Christmas List</span>
            <span className="feature">🎅 Santa Tracker</span>
            <span className="feature">❄️ Winter Fun</span>
          </div>
          <button className="btn-primary btn-large" onClick={() => navigate('/players')}>
            🎄 Open Christmas Lab
          </button>
        </div>
      </div>

      <div className="featured-players">
        <h2>Our Players</h2>
        <div className="player-cards">
          {players.map((player) => (
            <div key={player.id} className="featured-card">
              <Avatar type={player.avatarType} size="large" />
              <p className="player-name">{player.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
