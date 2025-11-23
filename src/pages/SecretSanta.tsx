import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getActivePlayerId,
  getPlayers,
  getSecretSantaEvent,
  addSecretSantaParticipant,
  removeSecretSantaParticipant,
  assignSecretSanta,
  resetSecretSanta,
  getSecretSantaAssignment,
} from '../utils/storage';
import type { Player, SecretSantaEvent } from '../types';
import { Avatar } from '../components/Avatar';
import './SecretSanta.css';

export const SecretSanta = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [event, setEvent] = useState<SecretSantaEvent | null>(null);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [assignment, setAssignment] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

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
      const santaEvent = getSecretSantaEvent(playerId);
      setEvent(santaEvent);
    } else {
      navigate('/players');
    }
  }, [navigate]);

  const handleAddParticipant = () => {
    if (!player || !newParticipantName.trim()) return;

    const updatedEvent = addSecretSantaParticipant(player.id, newParticipantName);
    setEvent(updatedEvent);
    setNewParticipantName('');
  };

  const handleRemoveParticipant = (participantId: string) => {
    if (!player) return;
    const updatedEvent = removeSecretSantaParticipant(player.id, participantId);
    setEvent(updatedEvent);
  };

  const handleSpinWheel = () => {
    if (!player || !event || event.participants.length < 2) return;

    setIsSpinning(true);
    
    // Spin animation
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = wheelRotation + (360 * spins);
    setWheelRotation(finalRotation);

    setTimeout(() => {
      const updatedEvent = assignSecretSanta(player.id);
      setEvent(updatedEvent);
      setIsSpinning(false);
    }, 3000);
  };

  const handleViewAssignment = () => {
    if (!player || !selectedParticipant) return;
    const receiver = getSecretSantaAssignment(player.id, selectedParticipant);
    setAssignment(receiver);
  };

  const handleReset = () => {
    if (!player) return;
    const updatedEvent = resetSecretSanta(player.id);
    setEvent(updatedEvent);
    setSelectedParticipant('');
    setAssignment(null);
  };

  if (!player || !event) {
    return <div>Loading...</div>;
  }

  const canSpin = event.participants.length >= 2 && !event.isAssigned;

  return (
    <div className="secret-santa-container">
      <div className="santa-header">
        <Avatar type={player.avatarType} size="medium" />
        <div className="santa-info">
          <h1>🎅 Secret Santa Wheel 🎁</h1>
          <p className="santa-subtitle">Spin to assign Secret Santas!</p>
        </div>
      </div>

      {!event.isAssigned ? (
        <>
          <div className="add-participant-section">
            <h2>Add Participants</h2>
            <div className="add-participant-form">
              <input
                type="text"
                placeholder="Enter participant name..."
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddParticipant()}
                className="participant-input"
                maxLength={50}
              />
              <button
                className="btn-primary btn-add"
                onClick={handleAddParticipant}
                disabled={!newParticipantName.trim()}
              >
                ➕ Add Participant
              </button>
            </div>
          </div>

          <div className="participants-section">
            <h2>Participants ({event.participants.length})</h2>
            {event.participants.length === 0 ? (
              <div className="empty-state">
                <p className="empty-icon">🎅</p>
                <p className="empty-text">Add at least 2 participants to start!</p>
              </div>
            ) : (
              <div className="participants-grid">
                {event.participants.map((participant) => (
                  <div key={participant.id} className="participant-card">
                    <span className="participant-name">{participant.name}</span>
                    <button
                      className="btn-remove-small"
                      onClick={() => handleRemoveParticipant(participant.id)}
                      title="Remove participant"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="wheel-section">
            <div className="wheel-container">
              <div
                className={`wheel ${isSpinning ? 'spinning' : ''}`}
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                <div className="wheel-center">
                  <span className="wheel-icon">🎁</span>
                </div>
                {event.participants.map((participant, index) => {
                  const angle = (index * 360) / event.participants.length;
                  return (
                    <div
                      key={participant.id}
                      className="wheel-segment"
                      style={{
                        transform: `rotate(${angle}deg)`,
                      }}
                    >
                      <div className="segment-label">{participant.name}</div>
                    </div>
                  );
                })}
              </div>
              <div className="wheel-pointer">▼</div>
            </div>

            <button
              className="btn-spin"
              onClick={handleSpinWheel}
              disabled={!canSpin || isSpinning}
            >
              {isSpinning ? '🎄 Spinning...' : '🎅 Spin the Wheel!'}
            </button>

            {event.participants.length < 2 && (
              <p className="hint-text">Need at least 2 participants to spin!</p>
            )}
          </div>
        </>
      ) : (
        <div className="assignment-section">
          <div className="success-message">
            <span className="success-icon">✨</span>
            <h2>Secret Santas Assigned!</h2>
            <p>Each participant can now check who they're buying for.</p>
          </div>

          <div className="check-assignment">
            <h3>Check Your Assignment</h3>
            <select
              className="participant-select"
              value={selectedParticipant}
              onChange={(e) => {
                setSelectedParticipant(e.target.value);
                setAssignment(null);
              }}
            >
              <option value="">Select your name...</option>
              {event.participants.map((participant) => (
                <option key={participant.id} value={participant.name}>
                  {participant.name}
                </option>
              ))}
            </select>

            <button
              className="btn-reveal"
              onClick={handleViewAssignment}
              disabled={!selectedParticipant}
            >
              🎁 Reveal My Secret Santa Assignment
            </button>

            {assignment && (
              <div className="assignment-reveal">
                <p className="assignment-text">
                  <strong>{selectedParticipant}</strong>, you are the Secret Santa for:
                </p>
                <div className="assignment-box">
                  <span className="gift-icon">🎁</span>
                  <h2>{assignment}</h2>
                  <span className="gift-icon">🎁</span>
                </div>
                <p className="hint-text">🤫 Keep it secret!</p>
              </div>
            )}
          </div>

          <button className="btn-secondary btn-reset" onClick={handleReset}>
            🔄 Start New Secret Santa
          </button>
        </div>
      )}

      <div className="nav-buttons">
        <button className="btn-back" onClick={() => navigate('/christmas-lab')}>
          ← Back to Christmas Lab
        </button>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          🏠 Home
        </button>
      </div>
    </div>
  );
};
