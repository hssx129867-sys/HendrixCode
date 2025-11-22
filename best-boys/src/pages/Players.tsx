import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlayers, savePlayers, setActivePlayerId } from '../utils/storage';
import type { Player, AvatarType } from '../types';
import { Avatar } from '../components/Avatar';
import './Players.css';

export const Players = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>(getPlayers());
  const [showForm, setShowForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    favoriteColor: '#FF6B6B',
    avatarType: 'star' as AvatarType,
  });

  const handleSelectPlayer = (playerId: string) => {
    setActivePlayerId(playerId);
    navigate('/play');
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.name.trim()) return;

    const player: Player = {
      id: Date.now().toString(),
      name: newPlayer.name,
      favoriteColor: newPlayer.favoriteColor,
      avatarType: newPlayer.avatarType,
      progress: {},
    };

    const updatedPlayers = [...players, player];
    setPlayers(updatedPlayers);
    savePlayers(updatedPlayers);
    
    setNewPlayer({
      name: '',
      favoriteColor: '#FF6B6B',
      avatarType: 'star',
    });
    setShowForm(false);
  };

  return (
    <div className="players-container">
      <h1>Choose Your Player</h1>

      <div className="player-list">
        {players.map((player) => (
          <div
            key={player.id}
            className="player-card"
            onClick={() => handleSelectPlayer(player.id)}
            style={{ borderColor: player.favoriteColor }}
          >
            <Avatar type={player.avatarType} size="large" />
            <h3>{player.name}</h3>
            <div
              className="color-indicator"
              style={{ backgroundColor: player.favoriteColor }}
            />
          </div>
        ))}
      </div>

      {!showForm && (
        <button className="btn-secondary" onClick={() => setShowForm(true)}>
          ➕ Add New Player
        </button>
      )}

      {showForm && (
        <form onSubmit={handleAddPlayer} className="player-form">
          <h3>Create New Player</h3>
          
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={newPlayer.name}
              onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Favorite Color:</label>
            <select
              value={newPlayer.favoriteColor}
              onChange={(e) => setNewPlayer({ ...newPlayer, favoriteColor: e.target.value })}
            >
              <option value="#FF6B6B">Red</option>
              <option value="#4ECDC4">Teal</option>
              <option value="#95E1D3">Mint</option>
              <option value="#FFE66D">Yellow</option>
              <option value="#A8E6CF">Green</option>
              <option value="#FF8B94">Pink</option>
              <option value="#C7CEEA">Purple</option>
            </select>
          </div>

          <div className="form-group">
            <label>Choose Avatar:</label>
            <div className="avatar-choices">
              {(['star', 'robot', 'lightbulb', 'rocket'] as AvatarType[]).map((type) => (
                <div
                  key={type}
                  className={`avatar-choice ${newPlayer.avatarType === type ? 'selected' : ''}`}
                  onClick={() => setNewPlayer({ ...newPlayer, avatarType: type })}
                >
                  <Avatar type={type} size="medium" />
                </div>
              ))}
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              Create Player
            </button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <button className="btn-back" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
    </div>
  );
};
