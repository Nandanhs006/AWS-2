import React, { useState } from 'react';

interface TopBarProps {
  activeScreen: string;
  onSelectScreen: (screenId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ activeScreen, onSelectScreen }) => {
  const [logoLoaded, setLogoLoaded] = useState(true);

  const screens = [
    { id: 'studio', label: 'Trigger Studio' },
    { id: 'datatrust', label: 'Data Trust' },
    { id: 'replay', label: 'Season Replay' },
    { id: 'desk', label: 'Heat-Day Desk' },
    { id: 'decisions', label: 'Decision Record' },
  ];

  return (
    <header>
      {/* Primary Top Bar */}
      <div className="top-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Logo Placeholder (240x52 horizontal rectangle) */}
          <div className="logo-container" style={{ width: 240, height: 50 }}>
            {logoLoaded ? (
              <img
                src="/logo.png"
                alt="Mausam Dhaal Logo"
                className="logo-img"
                onError={() => setLogoLoaded(false)}
              />
            ) : (
              <div className="logo-fallback">
                <span className="logo-fallback-title">Mausam Dhaal</span>
                <span className="logo-fallback-sub">Heat Cover Workbench</span>
              </div>
            )}
          </div>

          <div style={{ borderLeft: '1px solid #4C5868', height: '28px' }} />

          {/* Program Context */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', color: '#AAB7B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Programme Cohort
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
              Informal Outdoor Workers Heat Protection
            </span>
          </div>
        </div>

        {/* Top Right Controls & Role */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>Programme Officer</div>
            <div style={{ fontSize: '11px', color: '#AAB7B8' }}>Active Season 2026</div>
          </div>
          <span
            style={{
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: '#1E4620',
              color: '#C8E6C9',
              borderRadius: '2px',
              border: '1px solid #2E7D32',
            }}
          >
            Reviewer Audited
          </span>
        </div>
      </div>

      {/* Secondary Navigation Tabs Bar */}
      <nav className="nav-tabs-bar">
        {screens.map((screen) => (
          <button
            key={screen.id}
            type="button"
            className={`nav-tab-btn ${activeScreen === screen.id ? 'active' : ''}`}
            onClick={() => onSelectScreen(screen.id)}
          >
            {screen.label}
          </button>
        ))}
      </nav>
    </header>
  );
};
