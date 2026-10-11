import React, { useState } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { loginAs } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('officer');
  const [email, setEmail] = useState('ramilaben@sewa.org');
  const [password, setPassword] = useState('••••••••••••');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'officer') {
      setEmail('ramilaben@sewa.org');
    } else {
      setEmail('v.sengupta@climaterisk.org');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs(selectedRole);
    onSuccess();
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        className="panel"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '32px',
          borderTop: '4px solid var(--primary-action)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '12px' }}>
            <div className="logo-container" style={{ width: 220, height: 48 }}>
              <img
                src="/logo.png"
                alt="Mausam Dhaal Logo"
                className="logo-img"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="logo-fallback" style={{ display: 'flex' }}>
                <span className="logo-fallback-title">Mausam Dhaal</span>
                <span className="logo-fallback-sub">Heat Cover Workbench</span>
              </div>
            </div>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginTop: '8px' }}>
            Institutional Portal Access
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Dual-Role Portal for Informal Worker Protection Programmes & Risk Underwriters
          </p>
        </div>

        {/* Dual Role Selector Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div
            onClick={() => handleRoleSelect('officer')}
            style={{
              padding: '14px',
              border: `2px solid ${selectedRole === 'officer' ? 'var(--primary-action)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: selectedRole === 'officer' ? 'var(--bg-surface-alt)' : 'var(--bg-surface)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <UserCheck size={18} color={selectedRole === 'officer' ? '#FF9900' : 'var(--text-secondary)'} />
              <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>
                Programme Officer
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Trade unions, cooperatives & NGOs. Full trigger design, budget solver & disbursement permissions.
            </p>
          </div>

          <div
            onClick={() => handleRoleSelect('reviewer')}
            style={{
              padding: '14px',
              border: `2px solid ${selectedRole === 'reviewer' ? 'var(--primary-action)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: selectedRole === 'reviewer' ? 'var(--bg-surface-alt)' : 'var(--bg-surface)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldCheck size={18} color={selectedRole === 'reviewer' ? '#FF9900' : 'var(--text-secondary)'} />
              <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>
                Auditor & Actuary
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Reinsurers, underwriters & municipal cells. Read-only audit verification & cryptographic ledger proof.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Authorized Account Email</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }}
              />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '34px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Security Credential Token</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }}
              />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '34px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px', marginTop: '6px' }}
          >
            Authenticate as {selectedRole === 'officer' ? 'Programme Officer' : 'Lead Auditor'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-muted)',
          }}
        >
          <span>Aligned with NDMA Heat Action Plan Framework</span>
          <span>Cryptographic Tamper-Evidence Standard</span>
        </div>
      </div>
    </div>
  );
};
