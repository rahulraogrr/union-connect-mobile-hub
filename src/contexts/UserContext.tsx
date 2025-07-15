import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'user' | 'manager' | 'director' | 'managing_director' | 'super';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  isAdminLevel: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const hasRole = (role: UserRole) => user?.role === role;
  
  const isAdminLevel = () => {
    if (!user) return false;
    return ['manager', 'director', 'managing_director', 'super'].includes(user.role);
  };

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    hasRole,
    isAdminLevel,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}