import React, { useState, useEffect } from 'react';
import './App.css';

// Dummy initial emoji data
const DEFAULT_EMOJIS = [
  { id: 1, symbol: '😂', name: 'Joy' },
  { id: 2, symbol: '😢', name: 'Sadness' },
  { id: 3, symbol: '😲', name: 'Surprise' },
  { id: 4, symbol: '😡', name: 'Anger' },
  { id: 5, symbol: '😍', name: 'Love' },
  { id: 6, symbol: '😱', name: 'Fear' }
];

// Netflix-like dark theme colors (override App.css below)
const NETFLIX_THEME = {
  '--bg-primary': '#141414',
  '--bg-secondary': '#221f1f',
  '--text-primary': '#fff',
  '--text-secondary': '#e50914',
  '--border-color': '#333',
  '--button-bg': '#e50914',
  '--button-text': '#fff'
};

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('netflix-dark');
  const [emojiList, setEmojiList] = useState(DEFAULT_EMOJIS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [emojiToDelete, setEmojiToDelete] = useState(null);
  const [addEmoji, setAddEmoji] = useState({ symbol: '', name: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply Netflix theme via CSS vars
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'netflix-dark') {
      Object.entries(NETFLIX_THEME).forEach(([k, v]) => {
        root.style.setProperty(k, v);
      });
    } else {
      // fallback to 'light' (App.css original)
      root.removeAttribute('style');
    }
  }, [theme]);

  // PUBLIC_INTERFACE
  const handleAddEmojiModal = () => setShowAddModal(true);
  // PUBLIC_INTERFACE
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setAddEmoji({ symbol: '', name: '' });
  };
  // PUBLIC_INTERFACE
  const handleOpenDeleteModal = (emoji) => {
    setEmojiToDelete(emoji);
    setShowDeleteModal(true);
  };
  // PUBLIC_INTERFACE
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setEmojiToDelete(null);
  };

  // PUBLIC_INTERFACE
  const handleDeleteEmoji = () => {
    setEmojiList(emojiList.filter(e => e.id !== emojiToDelete.id));
    handleCloseDeleteModal();
  };

  // PUBLIC_INTERFACE
  const handleAddEmoji = (e) => {
    e.preventDefault();
    if (
      !addEmoji.symbol.trim() ||
      !addEmoji.name.trim() ||
      emojiList.some(e => e.symbol === addEmoji.symbol)
    ) return;
    setEmojiList([
      ...emojiList,
      {
        id: Date.now(),
        symbol: addEmoji.symbol,
        name: addEmoji.name
      }
    ]);
    handleCloseAddModal();
  };

  // PUBLIC_INTERFACE
  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

  // PUBLIC_INTERFACE
  const handleThemeToggle = () =>
    setTheme(prev => (prev === 'netflix-dark' ? 'light' : 'netflix-dark'));

  return (
    <div className={`netflix-root${sidebarOpen ? ' sidebar-open' : ''}`}>
      {/* Sidebar */}
      <aside className={`netflix-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-logo text-glow">
          <span className="netflix-bold">Emotion<span style={{ color: '#e50914' }}>X</span></span>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="sidebar-link active">Emojis</a>
          <a href="#" className="sidebar-link">Analytics</a>
          <a href="#" className="sidebar-link">Sync</a>
        </nav>
        <div className="sidebar-bottom">
          <button
            className="sidebar-theme-btn"
            onClick={handleThemeToggle}
          >
            {theme === 'netflix-dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </aside>
      {/* Sidebar Overlay for mobile */}
      <div className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={handleSidebarToggle} />

      {/* Main Section */}
      <div className="main-content">
        <header className="netflix-header">
          <button className="menu-btn" onClick={handleSidebarToggle} aria-label="Toggle sidebar">
            <span />
            <span />
            <span />
          </button>
          <span className="header-title">Emoji Management</span>
          <div className="header-actions">
            <button
              className="add-emoji-btn"
              onClick={handleAddEmojiModal}
              aria-label="Add Emoji"
            >
              <span className="add-emoji-plus">+</span> Add Emoji
            </button>
          </div>
        </header>

        <section className="emoji-section">
          <div className="emoji-list-title">
            <h2>Your Emoji Set</h2>
            <span className="emoji-count">{emojiList.length} total</span>
          </div>
          <div className="emoji-container">
            {emojiList.map(e => (
              <div className="emoji-card" key={e.id}>
                <div className="emoji-symbol">{e.symbol}</div>
                <span className="emoji-name">{e.name}</span>
                <button className="emoji-delete-btn"
                  onClick={() => handleOpenDeleteModal(e)}
                  aria-label={`Delete emoji ${e.name}`}>
                  <span className="delete-x">×</span>
                </button>
              </div>
            ))}
            {emojiList.length === 0 && (
              <div className="emoji-empty">No emojis yet. Click "Add Emoji" to start!</div>
            )}
          </div>
        </section>
      </div>

      {/* Add Emoji Modal */}
      {showAddModal && (
        <Modal onClose={handleCloseAddModal}>
          <form className="modal-form" onSubmit={handleAddEmoji}>
            <h3>Add New Emoji</h3>
            <div className="form-group">
              <label>
                Emoji Symbol:
                <input
                  type="text"
                  value={addEmoji.symbol}
                  minLength={1}
                  maxLength={2}
                  required
                  placeholder="😎"
                  onChange={e => setAddEmoji(prev => ({
                    ...prev,
                    symbol: e.target.value.slice(0, 2)
                  }))}
                  style={{ fontSize: '2rem', width: 48, textAlign: 'center' }}
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Name:
                <input
                  type="text"
                  value={addEmoji.name}
                  required
                  placeholder="Ex: Excited"
                  onChange={e => setAddEmoji(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  style={{ width: 150 }}
                />
              </label>
            </div>
            <div className="modal-actions">
              <button type="submit" className="primary-btn">Add Emoji</button>
              <button type="button" className="secondary-btn" onClick={handleCloseAddModal}>Cancel</button>
            </div>
            <div className="modal-footnote">
              Duplicate emojis are not allowed.
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Emoji Modal */}
      {showDeleteModal && (
        <Modal onClose={handleCloseDeleteModal}>
          <div className="modal-dialog">
            <h3>Delete Emoji</h3>
            <div className="delete-confirm">
              Are you sure you want to delete
              <span className="emoji-symbol-big">{emojiToDelete.symbol}</span>
              <span className="emoji-name">{emojiToDelete.name}</span>?
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="danger-btn"
                onClick={handleDeleteEmoji}
              >
                Delete
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={handleCloseDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/**
 * Modal overlay/dialog.
 * @param {Object} props
 * @param {JSX.Element|JSX.Element[]} props.children
 * @param {()=>void} props.onClose
 */
function Modal({ children, onClose }) {
  useEffect(() => {
    // Trap escape key for modal close
    const handle = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [onClose]);
  return (
    <div className="netflix-modal-overlay" onClick={onClose}>
      <div className="netflix-modal" onClick={e => e.stopPropagation()}>
        {children}
        <button
          className="modal-close"
          aria-label="Close"
          tabIndex={0}
          onClick={onClose}
        >×</button>
      </div>
    </div>
  );
}

export default App;
