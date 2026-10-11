import React, { useState } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES, SupportedLanguage } from '../../context/LanguageContext';
import { ShieldCheck, UserCheck, Lock, Mail, ArrowRight, AlertCircle, Globe } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<UserRole>('officer');
  const [email, setEmail] = useState('ramilaben@sewa.org');
  const [password, setPassword] = useState('officer2026');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === 'officer') {
      setEmail('ramilaben@sewa.org');
      setPassword('officer2026');
    } else {
      setEmail('v.sengupta@climaterisk.org');
      setPassword('audit2026');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = login(email, password, selectedRole);
    if (res.success) {
      onSuccess();
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'var(--bg-page)',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '500px',
          width: '100%',
          padding: '24px 28px',
          borderTop: '4px solid var(--primary-action)',
          backgroundColor: 'var(--bg-surface)',
          position: 'relative',
        }}
      >
        {/* Language selector in top right of login card */}
        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Globe size={13} color="var(--text-muted)" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            style={{
              fontSize: '11px',
              padding: '2px 4px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-main)',
              cursor: 'pointer',
            }}
            title="Select Language"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName}
              </option>
            ))}
          </select>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '8px' }}>
            <img
              src="/logo.png"
              alt="HeatSutra Logo"
              style={{ height: '70px', width: 'auto', maxWidth: '240px', objectFit: 'contain' }}
            />
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '4px 0' }}>
            Institutional Portal Login
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
            HeatSutra · Parametric Heat-Cover Operations & Risk Audit
          </p>
        </div>

        {/* Institutional Role Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <div
            onClick={() => handleRoleSelect('officer')}
            style={{
              padding: '12px',
              border: `2px solid ${selectedRole === 'officer' ? 'var(--primary-action)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: selectedRole === 'officer' ? 'var(--bg-surface-alt)' : 'var(--bg-surface)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <UserCheck size={16} color={selectedRole === 'officer' ? '#FF9900' : 'var(--text-secondary)'} />
              <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--text-main)' }}>
                Programme Officer
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
              Union trigger design, budget calibration & payout disbursements.
            </p>
          </div>

          <div
            onClick={() => handleRoleSelect('reviewer')}
            style={{
              padding: '12px',
              border: `2px solid ${selectedRole === 'reviewer' ? 'var(--primary-action)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: selectedRole === 'reviewer' ? 'var(--bg-surface-alt)' : 'var(--bg-surface)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <ShieldCheck size={16} color={selectedRole === 'reviewer' ? '#FF9900' : 'var(--text-secondary)'} />
              <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--text-main)' }}>
                Auditor & Actuary
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
              Underwriters & municipal cells. Solvency audit & cryptographic ledger verification.
            </p>
          </div>
        </div>

        {/* Authentication Error Banner */}
        {errorMsg && (
          <div
            style={{
              backgroundColor: 'var(--tier-partial-bg)',
              border: '1px solid var(--tier-partial-border)',
              color: 'var(--tier-partial-text)',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Authorized Account Email</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail
                size={15}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }}
              />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '32px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Institutional Security Credential</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock
                size={15}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }}
              />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '32px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '9px', marginTop: '4px' }}
          >
            Sign In as {selectedRole === 'officer' ? 'Programme Officer' : 'Auditor & Actuary'}
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Credentials Quick Reference for Reviewers */}
        <div
          style={{
            marginTop: '16px',
            padding: '10px 12px',
            backgroundColor: 'var(--bg-surface-alt)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            lineHeight: 1.45,
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>
            Authorised Institutional Credentials:
          </div>
          <div>• <strong>Officer:</strong> ramilaben@sewa.org | Pass: <code>officer2026</code></div>
          <div>• <strong>Auditor:</strong> v.sengupta@climaterisk.org | Pass: <code>audit2026</code></div>
        </div>
      </div>
    </div>
  );
};
