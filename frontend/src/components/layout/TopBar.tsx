import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES, SupportedLanguage } from '../../context/LanguageContext';
import { LogOut, ShieldCheck, UserCheck, Globe } from 'lucide-react';

interface TopBarProps {
  activeScreen: string;
  onSelectScreen: (screenId: string) => void;
}

interface ScreenTab {
  id: string;
  labelKey: string;
  fallbackLabel: string;
  group: 'workbench' | 'science' | 'operations';
}

export const TopBar: React.FC<TopBarProps> = ({
  activeScreen,
  onSelectScreen,
}) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const screens: ScreenTab[] = [
    // Group 1: Core Workbench
    { id: 'studio', labelKey: 'nav.studio', fallbackLabel: 'Trigger Studio', group: 'workbench' },
    { id: 'distress', labelKey: 'nav.distress', fallbackLabel: 'Distress Map', group: 'workbench' },
    { id: 'desk', labelKey: 'nav.desk', fallbackLabel: 'Heat-Day Desk', group: 'workbench' },
    { id: 'replay', labelKey: 'nav.replay', fallbackLabel: 'Season Replay', group: 'workbench' },
    // Group 2: Climate Science & Data Trust
    { id: 'datatrust', labelKey: 'nav.datatrust', fallbackLabel: 'Data Trust', group: 'science' },
    { id: 'datasets', labelKey: 'nav.datasets', fallbackLabel: 'Open Datasets', group: 'science' },
    { id: 'microclimate', labelKey: 'nav.microclimate', fallbackLabel: 'Ward Heat Islands', group: 'science' },
    // Group 3: Operations & Governance
    { id: 'cohorts', labelKey: 'nav.cohorts', fallbackLabel: 'Cohort Registry', group: 'operations' },
    { id: 'actuarial', labelKey: 'nav.actuarial', fallbackLabel: 'Actuarial Solvency', group: 'operations' },
    { id: 'disbursement', labelKey: 'nav.disbursement', fallbackLabel: 'UPI Disbursement', group: 'operations' },
    { id: 'decisions', labelKey: 'nav.decisions', fallbackLabel: 'Decision Record', group: 'operations' },
    { id: 'contract', labelKey: 'nav.contract', fallbackLabel: 'Policy Schedule', group: 'operations' },
  ];

  return (
    <header>
      {/* Primary Top Bar */}
      <div className="top-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Logo */}
          <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => onSelectScreen('studio')}
            title="HeatSutra Home"
          >
            <img
              src="/logo.png"
              alt="HeatSutra Logo"
              style={{ height: '62px', width: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </div>

          <div style={{ borderLeft: '1px solid var(--border-color)', height: '24px' }} />

          {/* Program Context */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              {t('activeCohort')}
            </span>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('cohortSubtitle')}
            </span>
          </div>
        </div>

        {/* Top Right Controls & Role Management */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Regional Language Switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-surface-alt)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
            }}
          >
            <Globe size={14} color="var(--aws-orange)" />
            <select
              id="select-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text-main)',
                border: 'none',
                fontSize: '11.5px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
              title="Change Interface Language"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} style={{ color: '#0F172A', backgroundColor: '#FFFFFF' }}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Authenticated User Profile & Static Role Badge */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>{user.organization}</div>
              </div>

              {/* Static Role Badge */}
              <div
                id="badge-role-display"
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: user.role === 'officer' ? '#FEF3C7' : '#DCFCE7',
                  color: user.role === 'officer' ? '#92400E' : '#166534',
                  border: `1px solid ${user.role === 'officer' ? '#FCD34D' : '#86EFAC'}`,
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {user.role === 'officer' ? <UserCheck size={12} /> : <ShieldCheck size={12} />}
                {user.role === 'officer' ? t('officer') : t('reviewer')}
              </div>

              <button
                id="btn-logout"
                type="button"
                className="btn-secondary"
                onClick={logout}
                title="Log Out (Switch Account)"
                style={{
                  padding: '5px 8px',
                  backgroundColor: 'var(--bg-surface-alt)',
                  color: 'var(--text-main)',
                  borderColor: 'var(--border-color)',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <LogOut size={13} />
                <span>{t('logout')}</span>
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
                {t(screen.labelKey) || screen.fallbackLabel}
              </button>
            </React.Fragment>
          );
        })}
      </nav>
    </header>
  );
};
