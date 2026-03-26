import { createContext, useContext } from "react";
import { useMe } from "../hooks/useAuth";

interface AuthContextType {
  user: { id: string; name: string; email: string; avatar: string | null } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useMe();

  return (
    <AuthContext.Provider value={{
      user: user ?? null,
      isLoading,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);