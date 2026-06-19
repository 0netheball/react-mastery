import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

type User = {
  id: string;
  email: string;
  picture?: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    axios.get('/api/auth/me')
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const login = async (credential: string) => {
    const res = await axios.post('/api/auth/google', { credential });
    setUser(res.data.user);
  };

  const logout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
  };

  const loading = user === undefined;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user: user ?? null, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
