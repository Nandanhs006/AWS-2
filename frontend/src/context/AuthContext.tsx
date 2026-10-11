import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'officer' | 'reviewer';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  organization: string;
  email: string;
  badge: string;
}

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  officer: {
    id: 'USR-PO-8812',
    name: 'Ramilaben V. Parmar',
    role: 'officer',
    organization: 'Self-Employed Women’s Association (SEWA)',
    email: 'ramilaben@sewa.org',
    badge: 'Programme Officer',
  },
  reviewer: {
    id: 'USR-ACT-3041',
    name: 'Dr. Vikram Sengupta',
    role: 'reviewer',
    organization: 'Climate Risk Consortium & Heat Action Cell',
    email: 'v.sengupta@climaterisk.org',
    badge: 'Lead Actuary & Auditor',
  },
};

// Strict credentials store
const ROLE_CREDENTIALS: Record<UserRole, { email: string; passwords: string[] }> = {
  officer: {
    email: 'ramilaben@sewa.org',
    passwords: ['officer2026', 'sewa2026'],
  },
  reviewer: {
    email: 'v.sengupta@climaterisk.org',
    passwords: ['audit2026', 'actuary2026'],
  },
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string, role: UserRole) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Always initialize to null so landing page is strictly the Login Page
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = sessionStorage.getItem('mausam_dhaal_session_role');
    if (saved === 'officer' || saved === 'reviewer') {
      return DEMO_USERS[saved];
    }
    return null;
  });

  const login = (email: string, pass: string, role: UserRole): { success: boolean; error?: string } => {
    const creds = ROLE_CREDENTIALS[role];
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPass = pass.trim();

    if (normalizedEmail !== creds.email.toLowerCase()) {
      return {
        success: false,
        error: `Invalid email for ${role === 'officer' ? 'Programme Officer' : 'Auditor'} role. Authorized account: ${creds.email}`,
      };
    }

    if (!creds.passwords.includes(normalizedPass)) {
      return {
        success: false,
        error: 'Invalid password credential for selected institutional role.',
      };
    }

    const profile = DEMO_USERS[role];
    setUser(profile);
    sessionStorage.setItem('mausam_dhaal_session_role', role);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('mausam_dhaal_session_role');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

