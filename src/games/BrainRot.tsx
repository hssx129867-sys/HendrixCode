import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivePlayerId, getPlayers, updatePlayerProgress } from '../utils/storage';
import type { Player } from '../types';
import './BrainRot.css';

interface Building {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  production: number;
  owned: number;
  unlocked: boolean;
}

interface Area {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  unlocked: boolean;
  description: string;
}

interface BrainRotProgress {
  brainCells: number;
  buildings: Building[];
  areas: Area[];
  totalClicks: number;
}

const initialBuildings: Building[] = [
  { id: 'base1', name: 'Thinking Cap', emoji: '🎓', cost: 10, production: 1, owned: 0, unlocked: true },
  { id: 'base2', name: 'Brain Gym', emoji: '🏋️', cost: 50, production: 5, owned: 0, unlocked: true },
  { id: 'base3', name: 'Study Room', emoji: '📚', cost: 200, production: 20, owned: 0, unlocked: true },
  { id: 'base4', name: 'Lab Station', emoji: '🔬', cost: 1000, production: 100, owned: 0, unlocked: false },
  { id: 'base5', name: 'Robot Helper', emoji: '🤖', cost: 5000, production: 500, owned: 0, unlocked: false },
  { id: 'base6', name: 'Knights Inn', emoji: '🏰', cost: 99, production: 10, owned: 0, unlocked: false },
];

const initialAreas: Area[] = [
  { id: 'ground', name: 'Ground Floor', emoji: '🏠', cost: 0, unlocked: true, description: 'Where you start!' },
  { id: 'attic', name: 'Attic', emoji: '🪜', cost: 500, unlocked: false, description: 'Old treasures up here!' },
  { id: 'garage', name: 'Garage', emoji: '🚗', cost: 1500, unlocked: false, description: 'Build cool stuff!' },
  { id: 'basement', name: 'Basement', emoji: '🔦', cost: 5000, unlocked: false, description: 'Secret underground lab!' },
  { id: 'tower', name: 'Sky Tower', emoji: '🗼', cost: 15000, unlocked: false, description: 'Touch the clouds!' },
];

export const BrainRot = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [brainCells, setBrainCells] = useState(0);
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [areas, setAreas] = useState<Area[]>(initialAreas);
  const [totalClicks, setTotalClicks] = useState(0);
  const [message, setMessage] = useState('');

  // Load progress on mount
  useEffect(() => {
    const playerId = getActivePlayerId();
    if (!playerId) {
      navigate('/players');
      return;
    }

    const players = getPlayers();
    const foundPlayer = players.find((p) => p.id === playerId);
    if (!foundPlayer) {
      navigate('/players');
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlayer(foundPlayer);

    // Load brain rot progress
    const savedProgress = localStorage.getItem(`brainrot_${playerId}`);
    if (savedProgress) {
      const progress: BrainRotProgress = JSON.parse(savedProgress);
      setBrainCells(progress.brainCells);
      setBuildings(progress.buildings);
      setAreas(progress.areas);
      setTotalClicks(progress.totalClicks);
    }
  }, [navigate]);

  // Auto-generate brain cells from buildings
  useEffect(() => {
    const interval = setInterval(() => {
      const production = buildings.reduce((sum, b) => sum + b.production * b.owned, 0);
      if (production > 0) {
        setBrainCells((prev) => prev + production);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [buildings]);

  // Save progress
  useEffect(() => {
    if (player) {
      const progress: BrainRotProgress = {
        brainCells,
        buildings,
        areas,
        totalClicks,
      };
      localStorage.setItem(`brainrot_${player.id}`, JSON.stringify(progress));
    }
  }, [player, brainCells, buildings, areas, totalClicks]);

  const handleClick = () => {
    setBrainCells((prev) => prev + 1);
    setTotalClicks((prev) => prev + 1);
  };

  const buyBuilding = (buildingId: string) => {
    const building = buildings.find((b) => b.id === buildingId);
    if (!building || !building.unlocked) return;

    if (brainCells >= building.cost) {
      setBrainCells((prev) => prev - building.cost);
      setBuildings((prev) =>
        prev.map((b) => {
          if (b.id === buildingId) {
            const newCost = Math.floor(b.cost * 1.5);
            return { ...b, owned: b.owned + 1, cost: newCost };
          }
          return b;
        })
      );

      // Unlock next building
      const currentIndex = buildings.findIndex((b) => b.id === buildingId);
      if (currentIndex < buildings.length - 1) {
        setBuildings((prev) =>
          prev.map((b, idx) => (idx === currentIndex + 1 ? { ...b, unlocked: true } : b))
        );
      }

      setMessage(`🎉 Bought ${building.name}!`);
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage(`❌ Need ${building.cost - brainCells} more brain cells!`);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const unlockArea = (areaId: string) => {
    const area = areas.find((a) => a.id === areaId);
    if (!area || area.unlocked) return;

    if (brainCells >= area.cost) {
      setBrainCells((prev) => prev - area.cost);
      setAreas((prev) =>
        prev.map((a) => (a.id === areaId ? { ...a, unlocked: true } : a))
      );

      // Award stars to player
      if (player) {
        const currentProgress = player.progress['brainRot'] || { stars: 0, levelsCompleted: 0 };
        updatePlayerProgress(
          player.id,
          'brainRot',
          currentProgress.stars + 1,
          currentProgress.levelsCompleted + 1
        );
        
        // Update local player state
        const updatedPlayers = getPlayers();
        setPlayer(updatedPlayers.find((p) => p.id === player.id) || player);
      }

      setMessage(`🎉 Unlocked ${area.name}! ⭐ +1 Star!`);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`❌ Need ${area.cost - brainCells} more brain cells!`);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const getTotalProduction = () => {
    return buildings.reduce((sum, b) => sum + b.production * b.owned, 0);
  };

  if (!player) {
    return <div>Loading...</div>;
  }

  return (
    <div className="brain-rot-container">
      <div className="game-header">
        <h1>🧠 Brain Rot</h1>
        <p>Click to collect brain cells and build your empire!</p>
      </div>

      <div className="stats-panel">
        <div className="stat-card">
          <h2>🧠 Brain Cells</h2>
          <div className="big-number">{Math.floor(brainCells)}</div>
          <p>Per Second: {getTotalProduction()}</p>
        </div>
        <div className="stat-card">
          <h2>👆 Total Clicks</h2>
          <div className="big-number">{totalClicks}</div>
        </div>
      </div>

      {message && <div className="game-message">{message}</div>}

      <div className="clicker-section">
        <button className="brain-button" onClick={handleClick}>
          <span className="brain-emoji">🧠</span>
          <span>Click Me!</span>
        </button>
      </div>

      <div className="game-sections">
        <div className="section">
          <h2>🏗️ Buildings (Generate Brain Cells)</h2>
          <div className="items-grid">
            {buildings.map((building) => (
              <div
                key={building.id}
                className={`item-card ${!building.unlocked ? 'locked' : ''}`}
              >
                <div className="item-header">
                  <span className="item-emoji">{building.emoji}</span>
                  <h3>{building.name}</h3>
                </div>
                <p>+{building.production} per second</p>
                <p className="owned">Owned: {building.owned}</p>
                {building.unlocked ? (
                  <button
                    className="btn-buy"
                    onClick={() => buyBuilding(building.id)}
                    disabled={brainCells < building.cost}
                  >
                    Buy for {building.cost} 🧠
                  </button>
                ) : (
                  <button className="btn-locked" disabled>
                    🔒 Locked
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>🗺️ Areas to Unlock</h2>
          <div className="items-grid">
            {areas.map((area) => (
              <div
                key={area.id}
                className={`item-card ${area.unlocked ? 'unlocked' : ''}`}
              >
                <div className="item-header">
                  <span className="item-emoji">{area.emoji}</span>
                  <h3>{area.name}</h3>
                </div>
                <p>{area.description}</p>
                {area.unlocked ? (
                  <button className="btn-unlocked" disabled>
                    ✅ Unlocked
                  </button>
                ) : (
                  <button
                    className="btn-unlock"
                    onClick={() => unlockArea(area.id)}
                    disabled={brainCells < area.cost}
                  >
                    Unlock for {area.cost} 🧠
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="nav-buttons">
        <button className="btn-back" onClick={() => navigate('/play')}>
          ← Back to Games
        </button>
      </div>
    </div>
  );
};
