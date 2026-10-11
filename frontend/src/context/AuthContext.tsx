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

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginAs: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mausam_dhaal_user');
    if (saved === 'officer' || saved === 'reviewer') {
      return DEMO_USERS[saved];
    }
    // Default to logged-in as Programme Officer for immediate evaluation
    return DEMO_USERS.officer;
  });

  const loginAs = (role: UserRole) => {
    const profile = DEMO_USERS[role];
    setUser(profile);
    localStorage.setItem('mausam_dhaal_user', role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mausam_dhaal_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
