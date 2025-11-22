import { useNavigate } from 'react-router-dom';
import { getPlayers } from '../utils/storage';
import { Avatar } from '../components/Avatar';
import './Home.css';

export const Home = () => {
  const navigate = useNavigate();
  const players = getPlayers();

  return (
    <div className="home-container">
      <h1 className="home-title">🎮 Best Boys 🎮</h1>
      <p className="home-tagline">Fun logic games for awesome kids!</p>

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

      <button className="btn-primary btn-large" onClick={() => navigate('/players')}>
        🎯 Choose Your Player
      </button>
    </div>
  );
};
