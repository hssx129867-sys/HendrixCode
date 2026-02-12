import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getActivePlayerId,
  getPlayers,
  getShopInventory,
  getAllShopItems,
  addShopItem,
  removeShopItem,
  purchaseShopItem,
} from '../utils/storage';
import type { Player, ShopItem, ItemCategory } from '../types';
import { Avatar } from '../components/Avatar';
import { CockpitButton, CockpitPanel, CockpitPanelBody, CockpitContainer } from '../design-system';
import './YouTubeShop.css';

export const YouTubeShop = () => {
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [myItems, setMyItems] = useState<ShopItem[]>([]);
  const [allItems, setAllItems] = useState<ShopItem[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'myshop'>('browse');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<ItemCategory | 'all'>('all');

  // Form state
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState<ItemCategory>('merch');
  const [itemEmoji, setItemEmoji] = useState('🎁');

  useEffect(() => {
    const playerId = getActivePlayerId();
    if (!playerId) {
      navigate('/players');
      return;
    }

    const players = getPlayers();
    const foundPlayer = players.find((p) => p.id === playerId);
    if (foundPlayer) {
      setPlayer(foundPlayer);
      loadItems(playerId);
    } else {
      navigate('/players');
    }
  }, [navigate]);

  const loadItems = (playerId: string) => {
    const inventory = getShopInventory(playerId);
    setMyItems(inventory.items);
    setAllItems(getAllShopItems());
  };

  const handleAddItem = () => {
    if (!player || !itemName.trim()) return;

    const price = parseFloat(itemPrice) || 0;
    addShopItem(player.id, itemName.trim(), itemCategory, price, itemEmoji, itemDescription.trim());

    // Reset form
    setItemName('');
    setItemDescription('');
    setItemPrice('');
    setItemCategory('merch');
    setItemEmoji('🎁');
    setShowAddForm(false);

    // Reload items
    loadItems(player.id);
  };

  const handleRemoveItem = (itemId: string) => {
    if (!player) return;
    removeShopItem(player.id, itemId);
    loadItems(player.id);
  };

  const handlePurchase = (itemId: string) => {
    if (!player) return;
    purchaseShopItem(itemId);
    loadItems(player.id);
  };

  const filteredItems = allItems.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  if (!player) {
    return <div>Loading...</div>;
  }

  return (
    <div className="youtube-shop-page">
      <CockpitContainer size="xl">
        {/* Header */}
        <CockpitPanel variant="elevated" glow className="youtube-shop-header">
          <CockpitPanelBody>
            <div className="header-content">
              <Avatar type={player.avatarType} size="large" />
              <div className="header-info">
                <h1>📺 {player.name}'s YouTube Shop 🛍️</h1>
                <p className="header-subtitle">Create and sell your own merch and food items!</p>
              </div>
            </div>
          </CockpitPanelBody>
        </CockpitPanel>

        {/* Tabs */}
        <div className="shop-tabs">
          <CockpitButton
            variant={activeTab === 'browse' ? 'primary' : 'default'}
            size="large"
            onClick={() => setActiveTab('browse')}
          >
            🛍️ Browse Shop
          </CockpitButton>
          <CockpitButton
            variant={activeTab === 'myshop' ? 'primary' : 'default'}
            size="large"
            onClick={() => setActiveTab('myshop')}
          >
            🏪 My Shop ({myItems.length})
          </CockpitButton>
        </div>

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div className="browse-section">
            {/* Category Filter */}
            <div className="category-filter">
              <CockpitButton
                variant={filterCategory === 'all' ? 'primary' : 'default'}
                onClick={() => setFilterCategory('all')}
              >
                All Items
              </CockpitButton>
              <CockpitButton
                variant={filterCategory === 'merch' ? 'primary' : 'default'}
                onClick={() => setFilterCategory('merch')}
              >
                👕 Merch
              </CockpitButton>
              <CockpitButton
                variant={filterCategory === 'food' ? 'primary' : 'default'}
                onClick={() => setFilterCategory('food')}
              >
                🍔 Food
              </CockpitButton>
            </div>

            {/* Items Grid */}
            {filteredItems.length === 0 ? (
              <CockpitPanel variant="outlined">
                <CockpitPanelBody>
                  <p className="empty-message">No items available yet. Create your first item!</p>
                </CockpitPanelBody>
              </CockpitPanel>
            ) : (
              <div className="items-grid">
                {filteredItems.map((item) => (
                  <CockpitPanel key={item.id} variant="outlined" className="item-card">
                    <CockpitPanelBody>
                      <div className="item-emoji">{item.emoji}</div>
                      <h3 className="item-name">{item.name}</h3>
                      {item.description && <p className="item-description">{item.description}</p>}
                      <div className="item-meta">
                        <span className="item-category">
                          {item.category === 'merch' ? '👕 Merch' : '🍔 Food'}
                        </span>
                        <span className="item-price">${item.price.toFixed(2)}</span>
                      </div>
                      <div className="item-stats">
                        <span className="item-purchases">🛒 {item.purchases} sold</span>
                      </div>
                      <CockpitButton
                        variant="primary"
                        size="large"
                        onClick={() => handlePurchase(item.id)}
                      >
                        Buy Now
                      </CockpitButton>
                    </CockpitPanelBody>
                  </CockpitPanel>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Shop Tab */}
        {activeTab === 'myshop' && (
          <div className="myshop-section">
            {/* Add Item Button */}
            {!showAddForm && (
              <CockpitButton
                variant="primary"
                size="large"
                onClick={() => setShowAddForm(true)}
              >
                ➕ Create New Item
              </CockpitButton>
            )}

            {/* Add Item Form */}
            {showAddForm && (
              <CockpitPanel variant="elevated" glow className="add-item-form">
                <CockpitPanelBody>
                  <h3>Create New Item</h3>
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="Item name"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <input
                      type="text"
                      value={itemDescription}
                      onChange={(e) => setItemDescription(e.target.value)}
                      placeholder="Item description (optional)"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category:</label>
                    <select
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value as ItemCategory)}
                      className="form-select"
                    >
                      <option value="merch">👕 Merch</option>
                      <option value="food">🍔 Food</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price ($):</label>
                    <input
                      type="number"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Emoji:</label>
                    <input
                      type="text"
                      value={itemEmoji}
                      onChange={(e) => setItemEmoji(e.target.value)}
                      placeholder="🎁"
                      className="form-input"
                      maxLength={4}
                    />
                  </div>
                  <div className="form-actions">
                    <CockpitButton variant="primary" onClick={handleAddItem}>
                      Create Item
                    </CockpitButton>
                    <CockpitButton onClick={() => setShowAddForm(false)}>
                      Cancel
                    </CockpitButton>
                  </div>
                </CockpitPanelBody>
              </CockpitPanel>
            )}

            {/* My Items */}
            {myItems.length === 0 ? (
              <CockpitPanel variant="outlined">
                <CockpitPanelBody>
                  <p className="empty-message">You haven't created any items yet. Click "Create New Item" to get started!</p>
                </CockpitPanelBody>
              </CockpitPanel>
            ) : (
              <div className="items-grid">
                {myItems.map((item) => (
                  <CockpitPanel key={item.id} variant="outlined" className="item-card">
                    <CockpitPanelBody>
                      <div className="item-emoji">{item.emoji}</div>
                      <h3 className="item-name">{item.name}</h3>
                      {item.description && <p className="item-description">{item.description}</p>}
                      <div className="item-meta">
                        <span className="item-category">
                          {item.category === 'merch' ? '👕 Merch' : '🍔 Food'}
                        </span>
                        <span className="item-price">${item.price.toFixed(2)}</span>
                      </div>
                      <div className="item-stats">
                        <span className="item-purchases">🛒 {item.purchases} sold</span>
                      </div>
                      <CockpitButton
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove Item
                      </CockpitButton>
                    </CockpitPanelBody>
                  </CockpitPanel>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="nav-buttons">
          <CockpitButton onClick={() => navigate('/')}>
            🏠 Home
          </CockpitButton>
        </div>
      </CockpitContainer>
    </div>
  );
};
