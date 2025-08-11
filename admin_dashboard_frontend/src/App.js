import React, { useState, useEffect } from 'react';
import './App.css';
import { AnalyticsWidgetGrid } from './AnalyticsWidgets';

/** 
 * Default emoji data, now with metadata.
 */
const DEFAULT_EMOJIS = [
  { id: 1, symbol: '😂', name: 'Joy', description: 'Expresses laughter and happiness', category: 'Positive' },
  { id: 2, symbol: '😢', name: 'Sadness', description: 'Signifies crying and sadness', category: 'Negative' },
  { id: 3, symbol: '😲', name: 'Surprise', description: 'Shows astonishment or shock', category: 'Neutral' },
  { id: 4, symbol: '😡', name: 'Anger', description: 'Represents annoyance or anger', category: 'Negative' },
  { id: 5, symbol: '😍', name: 'Love', description: 'Shows love or adoration', category: 'Positive' },
  { id: 6, symbol: '😱', name: 'Fear', description: 'Indicates fear or panic', category: 'Negative' }
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

/**
 * Simple area/line chart mock component using SVG and demo data.
 */
function MiniChart({ points = [7, 4, 9, 5, 13, 12, 11], color="#e50914", fill="#e5091433", height=60 }) {
  // Responsive SVG width based on points length
  const width = 120;
  const domainY = [0, Math.max(...points, 1)];
  const h = height;
  const step = width / (points.length - 1);
  // Scale Y
  const valueToY = v => h - ((v - domainY[0]) / (domainY[1] - domainY[0]) * h);
  // Points as string for SVG polyline
  const pointStr = points.map((v, i) => `${i * step},${valueToY(v)}`).join(" ");
  // Area for filled shape
  const areaStr = `${points.map((v, i) => `${i*step},${valueToY(v)}`).join(" ")} ${width},${h} 0,${h}`;
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} style={{display:"block"}}>
      <polyline fill={fill} stroke="none" points={areaStr} />
      <polyline fill="none" stroke={color} strokeWidth="3" points={pointStr} />
      <circle r={4} fill={color} cx={width} cy={valueToY(points[points.length-1])} />
    </svg>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('netflix-dark');
  const [emojiList, setEmojiList] = useState(DEFAULT_EMOJIS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [emojiToDelete, setEmojiToDelete] = useState(null);
  // Add emoji supports symbol, name, description, category
  const [addEmoji, setAddEmoji] = useState({ symbol: '', name: '', description: '', category: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Helper: Emoji category options
  const CATEGORY_OPTIONS = [
    'Positive', 'Negative', 'Neutral', 'Surprise', 'Love', 'Other'
  ];

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
      !addEmoji.category.trim() ||
      emojiList.some(e => e.symbol === addEmoji.symbol)
    ) return;
    setEmojiList([
      ...emojiList,
      {
        id: Date.now(),
        symbol: addEmoji.symbol,
        name: addEmoji.name,
        description: addEmoji.description,
        category: addEmoji.category
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
      <div className="main-content netflix-analytics-main">
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

        <div className="analytics-grid-area">
          <section className="emoji-section analytics-emoji-row">
            <div className="emoji-list-title">
              <h2>Your Emoji Set</h2>
              <span className="emoji-count">{emojiList.length} total</span>
            </div>
            <div className="emoji-container-wrapped">
              {emojiList.map(e => (
                <div className="emoji-card"
                     key={e.id}
                     tabIndex={0}
                     title={e.description || ''}
                     style={{
                       boxShadow: "0 4px 16px 0 rgba(229,9,20,.06)",
                       outline: 'none'
                     }}
                     onFocus={evt=>evt.currentTarget.classList.add('focus')}
                     onBlur={evt=>evt.currentTarget.classList.remove('focus')}
                >
                  <div className="emoji-symbol"
                    tabIndex={-1}
                    aria-label={e.description || e.name}
                  >
                    {e.symbol}
                  </div>
                  <span className="emoji-name">{e.name}</span>
                  <span className="emoji-category" style={{
                    fontSize: '0.98em',
                    color: 'var(--text-secondary)',
                    opacity: 0.88,
                    fontWeight: 500,
                    marginBottom: "3px",
                    background: "#22000021",
                    borderRadius: 6,
                    padding: "1px 7px",
                    letterSpacing: 0.1
                  }}>{e.category}</span>
                  {e.description && (
                    <span className="emoji-desc"
                      style={{
                        fontSize: '0.95em',
                        color: '#fff7',
                        margin: "2px 0 0 0",
                        lineHeight: 1.1,
                        textAlign: "center"
                      }}
                    >{e.description}</span>
                  )}
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
          {/* All analytics widgets and stats/cards strictly grouped below or beside emoji grid */}
          <div className="analytics-section-group">
            <AnalyticsWidgetGrid />
          </div>
        </div>
      </div>

      {/* Add Emoji Modal */}
      {showAddModal && (
        <Modal onClose={handleCloseAddModal}>
          <form className="modal-form" onSubmit={handleAddEmoji} autoComplete="off">
            {/* form content unchanged */}
            <h3 style={{display:"flex",alignItems:"center",gap:7}}>
              <span style={{
                fontSize: "1.5em",
                textShadow: "0 2px 6px #901d22"
              }}>✨</span> Add New Emoji
            </h3>
            {/* rest of modal code unchanged */}
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
                  autoFocus
                  onChange={e => setAddEmoji(prev => ({
                    ...prev,
                    symbol: e.target.value.replace(/[^\p{Emoji}\p{Symbol}]/gu, '').slice(0, 2)
                  }))}
                  style={{
                    fontSize: '2rem',
                    width: 54,
                    height: 42,
                    textAlign: 'center',
                    border: "1.2px solid var(--border-color)",
                    borderRadius: 10,
                    marginTop: 3
                  }}
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
                  autoComplete="off"
                  onChange={e => setAddEmoji(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  style={{
                    width: 190,
                    border: "1.2px solid var(--border-color)",
                    borderRadius: 9,
                    minHeight: 35
                  }}
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Description:
                <input
                  type="text"
                  value={addEmoji.description}
                  placeholder="Optional (ex: Laughter or happy tears)"
                  onChange={e => setAddEmoji(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  style={{
                    width: 230,
                    border: "1.2px solid var(--border-color)",
                    borderRadius: 8,
                    minHeight: 34
                  }}
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Category:
                <select
                  value={addEmoji.category}
                  required
                  onChange={e => setAddEmoji(prev => ({
                    ...prev,
                    category: e.target.value
                  }))}
                  style={{
                    width: "70%",
                    minWidth: 120,
                    border: "1.2px solid var(--border-color)",
                    borderRadius: 8,
                    minHeight: 33,
                    color: addEmoji.category ? 'inherit' : "var(--text-secondary)",
                    background: addEmoji.category ? 'inherit' : "#000"
                  }}
                >
                  <option value="" disabled>
                    Select category...
                  </option>
                  {CATEGORY_OPTIONS.map(opt => (
                    <option value={opt} key={opt}>{opt}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <button
                type="submit"
                className="primary-btn"
                style={{
                  boxShadow:"0 2px 10px #e509140c",
                  letterSpacing:1.1
                }}
              >
                Add Emoji
              </button>
              <button type="button" className="secondary-btn" onClick={handleCloseAddModal}>
                Cancel
              </button>
            </div>
            <div className="modal-footnote" style={{textAlign:"left"}}>
              <span style={{color:"var(--text-secondary)", fontWeight:600, marginRight:4}}>Tips: </span>
              Duplicate emoji symbols are not allowed. Try one or two Unicode emoji per symbol. 
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
