import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'user' | 'manager' | 'director' | 'managing_director' | 'super';

export interface User {
  id: string;
  username: string;
  roles: UserRole[]; // Changed to array for multiple roles
  name: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  getHighestRole: () => UserRole | null;
  isAdminLevel: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const hasRole = (role: UserRole) => user?.roles.includes(role) ?? false;
  
  const hasAnyRole = (roles: UserRole[]) => 
    user ? roles.some(role => user.roles.includes(role)) : false;
  
  // Get the highest permission level role
  const getHighestRole = (): UserRole | null => {
    if (!user?.roles.length) return null;
    
    const roleHierarchy: UserRole[] = ['super', 'managing_director', 'director', 'manager', 'user'];
    
    for (const role of roleHierarchy) {
      if (user.roles.includes(role)) {
        return role;
      }
    }
    return 'user';
  };
  
  const isAdminLevel = () => {
    if (!user) return false;
    return hasAnyRole(['manager', 'director', 'managing_director', 'super']);
  };

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    hasRole,
    hasAnyRole,
    getHighestRole,
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