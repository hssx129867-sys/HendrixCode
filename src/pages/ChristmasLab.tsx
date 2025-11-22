import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getActivePlayerId, getPlayers, getDaysUntilChristmas } from '../utils/storage';
import type { Player } from '../types';
import { Avatar } from '../components/Avatar';
import './ChristmasLab.css';

export const ChristmasLab = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const daysUntilChristmas = getDaysUntilChristmas();

  useEffect(() => {
    const playerId = getActivePlayerId();
    if (!playerId) {
      navigate('/players');
      return;
    }

    const players = getPlayers();
    const foundPlayer = players.find((p) => p.id === playerId);
    if (foundPlayer) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlayer(foundPlayer);
    } else {
      navigate('/players');
    }
  }, [navigate]);

  if (!player) {
    return <div>Loading...</div>;
  }

  return (
    <div className="christmas-lab-container">
      <div className="christmas-header">
        <Avatar type={player.avatarType} size="large" />
        <div className="christmas-info">
          <h1>🎄 {player.name}'s Christmas Lab 🎄</h1>
          <div className="countdown">
            <span className="countdown-number">{daysUntilChristmas}</span>
            <span className="countdown-text">days until Christmas!</span>
          </div>
        </div>
      </div>

      <div className="christmas-tools-grid">
        <div className="christmas-tool-card">
          <div className="tool-icon">🎁</div>
          <h3>Christmas List</h3>
          <p>Create your wish list for Santa!</p>
          <button
            className="btn-primary"
            onClick={() => navigate('/christmas-list')}
          >
            Make Your List
          </button>
        </div>

        <div className="christmas-tool-card coming-soon">
          <div className="tool-icon">🎅</div>
          <h3>Santa's Workshop</h3>
          <p>Track what Santa is making!</p>
          <button className="btn-secondary" disabled>
            Coming Soon!
          </button>
        </div>

        <div className="christmas-tool-card coming-soon">
          <div className="tool-icon">❄️</div>
          <h3>Winter Games</h3>
          <p>Fun winter-themed activities!</p>
          <button className="btn-secondary" disabled>
            Coming Soon!
          </button>
        </div>
      </div>

      <div className="nav-buttons">
        <button className="btn-back" onClick={() => navigate('/play')}>
          ← Back to Game Zone
        </button>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          🏠 Home
        </button>
      </div>
    </div>
  );
};
