import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPlayers, getActivePlayerId } from '../utils/storage';
import type { Player } from '../types';
import { Avatar } from '../components/Avatar';
import './Profile.css';

const gameNames: Record<string, string> = {
  pattern: '🎨 Pattern Builder',
  bugSquash: '🐛 Bug Squash',
  logicPath: '🧭 Logic Path',
};

export const Profile = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    // Load player data
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

  const getTotalStars = () => {
    return Object.values(player.progress).reduce((sum, prog) => sum + prog.stars, 0);
  };

  const getTotalLevels = () => {
    return Object.values(player.progress).reduce((sum, prog) => sum + prog.levelsCompleted, 0);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Avatar type={player.avatarType} size="large" />
        <div className="profile-info">
          <h1>{player.name}</h1>
          <div
            className="favorite-color-display"
            style={{ backgroundColor: player.favoriteColor }}
          >
            Favorite Color
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-value">{getTotalStars()}</div>
          <div className="stat-label">⭐ Total Stars</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{getTotalLevels()}</div>
          <div className="stat-label">🏆 Levels Completed</div>
        </div>
      </div>

      <div className="progress-section">
        <h2>Game Progress</h2>
        {Object.keys(player.progress).length === 0 ? (
          <p className="no-progress">No games played yet. Start playing to see your progress!</p>
        ) : (
          <div className="progress-list">
            {Object.entries(player.progress).map(([gameId, progress]) => (
              <div key={gameId} className="progress-item">
                <div className="game-name">{gameNames[gameId] || gameId}</div>
                <div className="progress-stats">
                  <span>⭐ {progress.stars} stars</span>
                  <span>📊 Level {progress.levelsCompleted}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="btn-primary btn-large" onClick={() => navigate('/play')}>
        🎮 Back to Games
      </button>
    </div>
  );
};
