import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, ShieldCheck, UserCheck } from 'lucide-react';

interface TopBarProps {
  activeScreen: string;
  onSelectScreen: (screenId: string) => void;
}

interface ScreenTab {
  id: string;
  label: string;
  group: 'workbench' | 'science' | 'operations';
}

export const TopBar: React.FC<TopBarProps> = ({
  activeScreen,
  onSelectScreen,
}) => {
  const { user, logout } = useAuth();
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
          <div className="logo-container" style={{ width: 220, height: 44, cursor: 'pointer' }} onClick={() => onSelectScreen('studio')}>
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

          <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.2)', height: '24px' }} />

          {/* Program Context */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: '#AAB7B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Union Cohort
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>
              SEWA Informal Workers Protection · 31 Pilot Hubs
            </span>
          </div>
        </div>

        {/* Top Right Controls & Role Management */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Authenticated User Profile & Static Non-Switchable Role Badge */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '10px', color: '#AAB7B8' }}>{user.organization}</div>
              </div>

              {/* Static Role Badge - Cannot be toggled on the fly */}
              <div
                id="badge-role-display"
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: user.role === 'officer' ? '#FF9900' : '#1E4620',
                  color: user.role === 'officer' ? '#111827' : '#C8E6C9',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {user.role === 'officer' ? <UserCheck size={12} /> : <ShieldCheck size={12} />}
                {user.badge}
              </div>

              <button
                id="btn-logout"
                type="button"
                className="btn-secondary"
                onClick={logout}
                title="Log Out (Switch Account)"
                style={{
                  padding: '5px 8px',
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <LogOut size={13} />
                <span>Log Out</span>
              </button>
            </div>
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
