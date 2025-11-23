import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivePlayerId, getPet, createPet, feedPet, playWithPet, healPet, restPet, changePetColor, activatePetAbility } from '../utils/storage';
import type { Pet, PetColor, AlienAbility } from '../types';
import './PetVet.css';

export const PetVet = () => {
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [showCreatePet, setShowCreatePet] = useState(false);
  const [petName, setPetName] = useState('');
  const [showPhotoStudio, setShowPhotoStudio] = useState(false);
  const [message, setMessage] = useState('');
  const [abilityActive, setAbilityActive] = useState(false);

  useEffect(() => {
    const playerId = getActivePlayerId();
    if (!playerId) {
      navigate('/players');
      return;
    }

    const existingPet = getPet(playerId);
    if (existingPet) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPet(existingPet);
    } else {
      setShowCreatePet(true);
    }
  }, [navigate]);

  const handleCreatePet = () => {
    if (!petName.trim()) {
      setMessage('Please give your alien pet a name! 👽');
      return;
    }

    const playerId = getActivePlayerId();
    if (playerId) {
      const newPet = createPet(playerId, petName);
      setPet(newPet);
      setShowCreatePet(false);
      setMessage(`Welcome ${petName}! Your alien pet is ready! 🎉`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleFeed = () => {
    const playerId = getActivePlayerId();
    if (playerId) {
      const updatedPet = feedPet(playerId);
      if (updatedPet) {
        setPet(updatedPet);
        setMessage('Yum! Your pet loved the space treats! 🍖✨');
        setTimeout(() => setMessage(''), 2000);
      }
    }
  };

  const handlePlay = () => {
    const playerId = getActivePlayerId();
    if (playerId) {
      const updatedPet = playWithPet(playerId);
      if (updatedPet) {
        setPet(updatedPet);
        setMessage('So much fun! Your pet gained experience! 🎮⭐');
        setTimeout(() => setMessage(''), 2000);
      }
    }
  };

  const handleHeal = () => {
    const playerId = getActivePlayerId();
    if (playerId) {
      const updatedPet = healPet(playerId);
      if (updatedPet) {
        setPet(updatedPet);
        setMessage('All better now! Health restored! 💚✨');
        setTimeout(() => setMessage(''), 2000);
      }
    }
  };

  const handleRest = () => {
    const playerId = getActivePlayerId();
    if (playerId) {
      const updatedPet = restPet(playerId);
      if (updatedPet) {
        setPet(updatedPet);
        setMessage('Zzzz... Your pet feels refreshed! 😴💫');
        setTimeout(() => setMessage(''), 2000);
      }
    }
  };

  const handleColorChange = (color: PetColor) => {
    const playerId = getActivePlayerId();
    if (playerId) {
      const updatedPet = changePetColor(playerId, color);
      if (updatedPet) {
        setPet(updatedPet);
        setMessage(`Color changed to ${color}! 🌈`);
        setTimeout(() => setMessage(''), 2000);
      }
    }
  };

  const handleAbility = (ability: AlienAbility) => {
    const playerId = getActivePlayerId();
    if (playerId && pet) {
      if (pet.stats.energy < 10) {
        setMessage('Not enough energy! Let your pet rest first. 💤');
        setTimeout(() => setMessage(''), 2000);
        return;
      }

      const updatedPet = activatePetAbility(playerId, ability);
      if (updatedPet) {
        setPet(updatedPet);
        setAbilityActive(true);
        
        let abilityMessage = '';
        switch (ability) {
          case 'teleport':
            abilityMessage = '💫 Teleporting across space! Whoosh!';
            break;
          case 'colorChange':
            abilityMessage = '🌈 Color shifting activated! So magical!';
            break;
          case 'shield':
            abilityMessage = '🛡️ Energy shield up! Protected!';
            break;
          case 'glow':
            abilityMessage = '✨ Glowing bright like a star!';
            break;
        }
        
        setMessage(abilityMessage);
        setTimeout(() => {
          setMessage('');
          setAbilityActive(false);
        }, 3000);
      }
    }
  };

  const getMoodEmoji = (mood: Pet['mood']) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'excited': return '🤩';
      case 'tired': return '😴';
      case 'sick': return '🤢';
      case 'energetic': return '⚡';
      default: return '😊';
    }
  };

  const getColorClass = (color: PetColor) => {
    return `pet-color-${color}`;
  };

  const getStatColor = (value: number) => {
    if (value >= 70) return '#4ade80';
    if (value >= 40) return '#fbbf24';
    return '#f87171';
  };

  if (showCreatePet) {
    return (
      <div className="pet-vet-container">
        <div className="create-pet-modal">
          <h1>🛸 Create Your Alien Pet! 👽</h1>
          <p>Give your special alien pet a name:</p>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="Enter pet name..."
            className="pet-name-input"
            maxLength={20}
          />
          <button onClick={handleCreatePet} className="btn-primary btn-large">
            Create Pet! 🚀
          </button>
        </div>
      </div>
    );
  }

  if (!pet) {
    return <div className="pet-vet-container">Loading your pet... 🐾</div>;
  }

  return (
    <div className="pet-vet-container">
      <div className="pet-header">
        <h1>🛸 Pet Vet: {pet.name}</h1>
        <div className="pet-level">
          Level {pet.level} ⭐ {pet.experience} XP
        </div>
      </div>

      {message && <div className="pet-message">{message}</div>}

      <div className="pet-display-area">
        <div className={`pet-avatar ${getColorClass(pet.color)} ${abilityActive ? 'ability-active' : ''}`}>
          <div className="pet-body">
            <div className="pet-eyes">
              <span className="eye">👁️</span>
              <span className="eye">👁️</span>
            </div>
            <div className="pet-mood">{getMoodEmoji(pet.mood)}</div>
          </div>
          <div className="pet-antenna">📡</div>
        </div>
        <div className="pet-name-display">{pet.name}</div>
        <div className="pet-mood-text">{pet.mood.toUpperCase()}</div>
      </div>

      <div className="pet-stats-grid">
        <div className="stat-bar">
          <div className="stat-label">❤️ Health</div>
          <div className="stat-progress">
            <div 
              className="stat-fill" 
              style={{ width: `${pet.stats.health}%`, backgroundColor: getStatColor(pet.stats.health) }}
            />
          </div>
          <div className="stat-value">{pet.stats.health}/100</div>
        </div>

        <div className="stat-bar">
          <div className="stat-label">😊 Happiness</div>
          <div className="stat-progress">
            <div 
              className="stat-fill" 
              style={{ width: `${pet.stats.happiness}%`, backgroundColor: getStatColor(pet.stats.happiness) }}
            />
          </div>
          <div className="stat-value">{pet.stats.happiness}/100</div>
        </div>

        <div className="stat-bar">
          <div className="stat-label">🍖 Hunger</div>
          <div className="stat-progress">
            <div 
              className="stat-fill" 
              style={{ width: `${pet.stats.hunger}%`, backgroundColor: getStatColor(100 - pet.stats.hunger) }}
            />
          </div>
          <div className="stat-value">{pet.stats.hunger}/100</div>
        </div>

        <div className="stat-bar">
          <div className="stat-label">⚡ Energy</div>
          <div className="stat-progress">
            <div 
              className="stat-fill" 
              style={{ width: `${pet.stats.energy}%`, backgroundColor: getStatColor(pet.stats.energy) }}
            />
          </div>
          <div className="stat-value">{pet.stats.energy}/100</div>
        </div>
      </div>

      <div className="pet-actions">
        <h3>🎮 Care Actions</h3>
        <div className="action-buttons">
          <button onClick={handleFeed} className="action-btn feed-btn">
            🍖 Feed
          </button>
          <button onClick={handlePlay} className="action-btn play-btn">
            🎮 Play
          </button>
          <button onClick={handleHeal} className="action-btn heal-btn">
            💚 Heal
          </button>
          <button onClick={handleRest} className="action-btn rest-btn">
            😴 Rest
          </button>
        </div>
      </div>

      <div className="alien-abilities">
        <h3>👽 Alien Abilities</h3>
        <div className="ability-buttons">
          {pet.abilities.map((ability) => (
            <button
              key={ability}
              onClick={() => handleAbility(ability)}
              className={`ability-btn ${pet.activeAbility === ability ? 'active' : ''}`}
              disabled={pet.stats.energy < 10}
            >
              {ability === 'teleport' && '💫 Teleport'}
              {ability === 'colorChange' && '🌈 Color Change'}
              {ability === 'shield' && '🛡️ Shield'}
              {ability === 'glow' && '✨ Glow'}
            </button>
          ))}
        </div>
      </div>

      <div className="color-picker">
        <h3>🎨 Change Color</h3>
        <div className="color-options">
          {(['purple', 'blue', 'green', 'pink', 'orange', 'rainbow'] as PetColor[]).map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`color-btn color-${color} ${pet.color === color ? 'selected' : ''}`}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="photo-studio-section">
        <h3>📸 Photo Studio</h3>
        <button 
          onClick={() => setShowPhotoStudio(!showPhotoStudio)} 
          className="btn-primary"
        >
          {showPhotoStudio ? 'Close Photo Studio' : 'Open Photo Studio'}
        </button>
        
        {showPhotoStudio && (
          <div className="photo-studio">
            <p className="studio-info">
              📷 Photo Studio coming soon! You'll be able to take pictures of your pet
              and add stickers, filters, and decorations! 🎨✨
            </p>
            <div className="pet-gallery">
              <h4>📸 Pet Photo Gallery ({pet.photos.length})</h4>
              {pet.photos.length === 0 ? (
                <p>No photos yet! Take your first picture! 📸</p>
              ) : (
                <div className="photo-grid">
                  {pet.photos.map((photo) => (
                    <div key={photo.id} className="photo-item">
                      <img src={photo.dataUrl} alt={photo.caption || 'Pet photo'} />
                      {photo.caption && <p className="photo-caption">{photo.caption}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="nav-buttons">
        <button className="btn-back" onClick={() => navigate('/play')}>
          ← Back to Games
        </button>
      </div>
    </div>
  );
};
