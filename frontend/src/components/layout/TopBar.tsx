import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, ShieldCheck, UserCheck } from 'lucide-react';

interface TopBarProps {
  activeScreen: string;
  onSelectScreen: (screenId: string) => void;
  onOpenLogin: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeScreen,
  onSelectScreen,
  onOpenLogin,
}) => {
  const { user, logout, loginAs } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [logoLoaded, setLogoLoaded] = useState(true);

  const screens = [
    { id: 'studio', label: 'Trigger Studio' },
    { id: 'distress', label: 'Distress Map' },
    { id: 'datatrust', label: 'Data Trust' },
    { id: 'datasets', label: 'Open Datasets' },
    { id: 'microclimate', label: 'Ward Heat Islands' },
    { id: 'replay', label: 'Season Replay' },
    { id: 'desk', label: 'Heat-Day Desk' },
    { id: 'cohorts', label: 'Cohort Registry' },
    { id: 'actuarial', label: 'Actuarial Solvency' },
    { id: 'disbursement', label: 'UPI Disbursement' },
    { id: 'decisions', label: 'Decision Record' },
    { id: 'contract', label: 'Policy Schedule' },
  ];

  return (
    <header>
      {/* Primary Top Bar */}
      <div className="top-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Logo Placeholder (240x50 horizontal rectangle) */}
          <div className="logo-container" style={{ width: 220, height: 46 }}>
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

          <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.2)', height: '26px' }} />

          {/* Program Context */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: '#AAB7B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Programme Cohort
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>
              SEWA Informal Workers Protection · Season 2026
            </span>
          </div>
        </div>

        {/* Top Right Controls & Role Management */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme Toggle (Light / Dark) */}
          <button
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
                type="button"
                onClick={() => loginAs(user.role === 'officer' ? 'reviewer' : 'officer')}
                title="Click to toggle role"
                style={{
                  padding: '3px 8px',
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
