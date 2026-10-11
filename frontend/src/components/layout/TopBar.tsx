import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, ShieldCheck, UserCheck, Presentation } from 'lucide-react';

interface TopBarProps {
  activeScreen: string;
  onSelectScreen: (screenId: string) => void;
  onOpenLogin: () => void;
  onOpenSeminarPitch: () => void;
}

interface ScreenTab {
  id: string;
  label: string;
  group: 'workbench' | 'science' | 'operations';
}

export const TopBar: React.FC<TopBarProps> = ({
  activeScreen,
  onSelectScreen,
  onOpenLogin,
  onOpenSeminarPitch,
}) => {
  const { user, logout, loginAs } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [logoLoaded, setLogoLoaded] = useState(true);

  const screens: ScreenTab[] = [
    // Group 1: Core Workbench
    { id: 'studio', label: 'Trigger Studio', group: 'workbench' },
    { id: 'distress', label: 'Distress Map', group: 'workbench' },
    { id: 'desk', label: 'Heat-Day Desk', group: 'workbench' },
    { id: 'replay', label: 'Season Replay', group: 'workbench' },
    // Group 2: Climate Science & Data Trust
    { id: 'datatrust', label: 'Data Trust', group: 'science' },
    { id: 'datasets', label: 'Open Datasets', group: 'science' },
    { id: 'microclimate', label: 'Ward Heat Islands', group: 'science' },
    // Group 3: Operations & Governance
    { id: 'cohorts', label: 'Cohort Registry', group: 'operations' },
    { id: 'actuarial', label: 'Actuarial Solvency', group: 'operations' },
    { id: 'disbursement', label: 'UPI Disbursement', group: 'operations' },
    { id: 'decisions', label: 'Decision Record', group: 'operations' },
    { id: 'contract', label: 'Policy Schedule', group: 'operations' },
  ];

  return (
    <header>
      {/* Primary Top Bar */}
      <div className="top-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Logo Container */}
          <div className="logo-container" style={{ width: 240, height: 48, cursor: 'pointer' }} onClick={() => onSelectScreen('studio')}>
            {logoLoaded ? (
              <img
                src="/logo.svg"
                alt="Mausam Dhaal Logo"
                className="logo-img"
                onError={() => setLogoLoaded(false)}
              />
            ) : (
              <div className="logo-fallback">
                <span className="logo-fallback-title">Mausam Dhaal · मौसम ढाल</span>
                <span className="logo-fallback-sub">Parametric Heat-Cover Workbench</span>
              </div>
            )}
          </div>

          <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.2)', height: '26px' }} />

          {/* Program Context */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: '#AAB7B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Union Cohort
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>
              SEWA Informal Workers Protection · 16 Pilot Hubs
            </span>
          </div>
        </div>

        {/* Top Right Controls & Role Management */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Executive Seminar Pitch Deck Launch Button */}
          <button
            id="btn-seminar-pitch-deck"
            type="button"
            className="btn-primary"
            onClick={onOpenSeminarPitch}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FF9900',
              color: '#111827',
              fontWeight: 700,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            <Presentation size={15} />
            Seminar Pitch Deck
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            id="btn-theme-toggle"
            type="button"
            className="btn-secondary"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light Console' : 'Dark Operations'} theme`}
            style={{
              padding: '6px 10px',
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              borderColor: 'rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
            }}
          >
            {theme === 'dark' ? <Sun size={15} color="#FF9900" /> : <Moon size={15} color="#AAB7B8" />}
            <span style={{ fontSize: '11px' }}>{theme === 'dark' ? 'Night Ops' : 'Console Light'}</span>
          </button>

          {/* User Profile & Role Switcher */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '10px', color: '#AAB7B8' }}>{user.organization}</div>
              </div>

              {/* Role Badge & Quick Switch */}
              <button
                id="btn-role-switcher"
                type="button"
                onClick={() => loginAs(user.role === 'officer' ? 'reviewer' : 'officer')}
                title="Click to toggle role between Programme Officer and Auditor/Reviewer"
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: user.role === 'officer' ? '#FF9900' : '#1E4620',
                  color: user.role === 'officer' ? '#111827' : '#C8E6C9',
                  borderRadius: '2px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {user.role === 'officer' ? <UserCheck size={12} /> : <ShieldCheck size={12} />}
                {user.badge}
              </button>

              <button
                id="btn-logout"
                type="button"
                className="btn-secondary"
                onClick={logout}
                title="Log Out"
                style={{
                  padding: '6px 8px',
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              id="btn-login"
              type="button"
              className="btn-primary"
              onClick={onOpenLogin}
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Secondary Navigation Tabs Bar with Pillar Badges */}
      <nav className="nav-tabs-bar">
        {screens.map((screen, idx) => {
          const isGroupStart = idx === 0 || screens[idx - 1].group !== screen.group;
          return (
            <React.Fragment key={screen.id}>
              {isGroupStart && idx !== 0 && (
                <div style={{ width: '1px', backgroundColor: 'var(--border-color)', margin: '8px 6px', height: '24px' }} />
              )}
              <button
                id={`nav-tab-${screen.id}`}
                type="button"
                className={`nav-tab-btn ${activeScreen === screen.id ? 'active' : ''}`}
                onClick={() => onSelectScreen(screen.id)}
              >
                {screen.label}
              </button>
            </React.Fragment>
          );
        })}
      </nav>
    </header>
  );
};
