import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getActivePlayerId,
  getPlayers,
  getChristmasList,
  addChristmasItem,
  removeChristmasItem,
  updateChristmasItem,
} from '../utils/storage';
import type { Player, ChristmasListItem } from '../types';
import { Avatar } from '../components/Avatar';
import './ChristmasList.css';

export const ChristmasList = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [items, setItems] = useState<ChristmasListItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemPriority, setNewItemPriority] = useState<'high' | 'medium' | 'low'>('medium');

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
      const list = getChristmasList(playerId);
      setItems(list.items);
    } else {
      navigate('/players');
    }
  }, [navigate]);

  const handleAddItem = () => {
    if (!player || !newItemName.trim()) return;

    addChristmasItem(player.id, {
      name: newItemName.trim(),
      description: newItemDescription.trim() || undefined,
      priority: newItemPriority,
    });

    const updatedList = getChristmasList(player.id);
    setItems(updatedList.items);
    setNewItemName('');
    setNewItemDescription('');
    setNewItemPriority('medium');
  };

  const handleRemoveItem = (itemId: string) => {
    if (!player) return;
    removeChristmasItem(player.id, itemId);
    const updatedList = getChristmasList(player.id);
    setItems(updatedList.items);
  };

  const handlePriorityChange = (itemId: string, priority: 'high' | 'medium' | 'low') => {
    if (!player) return;
    updateChristmasItem(player.id, itemId, { priority });
    const updatedList = getChristmasList(player.id);
    setItems(updatedList.items);
  };

  if (!player) {
    return <div>Loading...</div>;
  }

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case 'high':
        return '⭐⭐⭐';
      case 'medium':
        return '⭐⭐';
      case 'low':
        return '⭐';
      default:
        return '⭐';
    }
  };

  return (
    <div className="christmas-list-container">
      <div className="list-header">
        <Avatar type={player.avatarType} size="medium" />
        <div className="list-info">
          <h1>🎁 {player.name}'s Christmas List</h1>
          <p className="list-count">{items.length} items on your list</p>
        </div>
      </div>

      <div className="add-item-section">
        <h2>Add a New Item</h2>
        <div className="add-item-form">
          <input
            type="text"
            placeholder="What would you like? (e.g., Lego Set, Video Game)"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="item-input"
            maxLength={100}
          />
          <textarea
            placeholder="Tell Santa more about it... (optional)"
            value={newItemDescription}
            onChange={(e) => setNewItemDescription(e.target.value)}
            className="item-textarea"
            maxLength={200}
            rows={2}
          />
          <div className="priority-selector">
            <label>How much do you want it?</label>
            <div className="priority-buttons">
              <button
                className={`priority-btn ${newItemPriority === 'high' ? 'active' : ''}`}
                onClick={() => setNewItemPriority('high')}
              >
                ⭐⭐⭐ Really Want!
              </button>
              <button
                className={`priority-btn ${newItemPriority === 'medium' ? 'active' : ''}`}
                onClick={() => setNewItemPriority('medium')}
              >
                ⭐⭐ Would Like
              </button>
              <button
                className={`priority-btn ${newItemPriority === 'low' ? 'active' : ''}`}
                onClick={() => setNewItemPriority('low')}
              >
                ⭐ Would Be Nice
              </button>
            </div>
          </div>
          <button
            className="btn-primary btn-add"
            onClick={handleAddItem}
            disabled={!newItemName.trim()}
          >
            ➕ Add to List
          </button>
        </div>
      </div>

      <div className="items-section">
        <h2>Your Wish List</h2>
        {items.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">🎄</p>
            <p className="empty-text">Your list is empty! Add something you'd like for Christmas!</p>
          </div>
        ) : (
          <div className="items-grid">
            {items
              .sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
              })
              .map((item) => (
                <div key={item.id} className={`list-item priority-${item.priority}`}>
                  <div className="item-header">
                    <span className="item-priority">{getPriorityEmoji(item.priority)}</span>
                    <button
                      className="btn-remove"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remove from list"
                    >
                      ✕
                    </button>
                  </div>
                  <h3 className="item-name">{item.name}</h3>
                  {item.description && <p className="item-description">{item.description}</p>}
                  <div className="item-footer">
                    <select
                      value={item.priority}
                      onChange={(e) =>
                        handlePriorityChange(item.id, e.target.value as 'high' | 'medium' | 'low')
                      }
                      className="priority-select"
                    >
                      <option value="high">⭐⭐⭐ Really Want</option>
                      <option value="medium">⭐⭐ Would Like</option>
                      <option value="low">⭐ Nice to Have</option>
                    </select>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="nav-buttons">
        <button className="btn-back" onClick={() => navigate('/christmas-lab')}>
          ← Back to Christmas Lab
        </button>
        <button className="btn-secondary" onClick={() => window.print()}>
          🖨️ Print List
        </button>
      </div>
    </div>
  );
};
