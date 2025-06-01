// Updated for TypeScript migration
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "firebase/auth";
import { auth, isDemoMode } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ user: User | null; error: string | null }>;
  signup: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<{ user: User | null; error: string | null }>;
  loginWithGoogle: () => Promise<{ user: User | null; error: string | null }>;
  loginWithGithub: () => Promise<{ user: User | null; error: string | null }>;
  logout: () => Promise<{ success: boolean; error: string | null }>;
  resetPassword: (
    email: string,
  ) => Promise<{ success: boolean; error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);
  const [demoUser, setDemoUser] = useState<User | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);

  // Use Firebase auth in production, demo auth in development
  const currentUser = isDemoMode() ? demoUser : user;
  const isLoading = isDemoMode() ? demoLoading : loading;

  useEffect(() => {
    if (error) {
      console.error("Auth state error:", error);
    }
  }, [error]);

  const login = async (email: string, password: string) => {
    if (isDemoMode()) {
      setDemoLoading(true);
      const { demoAuth } = await import("../services/firebase");
      const result = await demoAuth.signInWithEmail(email, password);
      if (result.user) {
        setDemoUser(result.user);
      }
      setDemoLoading(false);
      return result;
    } else {
      const { signInWithEmail } = await import("../services/firebase");
      return await signInWithEmail(email, password);
    }
  };

  const signup = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    if (isDemoMode()) {
      setDemoLoading(true);
      const { demoAuth } = await import("../services/firebase");
      const result = await demoAuth.signUpWithEmail(
        email,
        password,
        displayName,
      );
      if (result.user) {
        setDemoUser(result.user);
      }
      setDemoLoading(false);
      return result;
    } else {
      const { signUpWithEmail } = await import("../services/firebase");
      return await signUpWithEmail(email, password, displayName);
    }
  };

  const loginWithGoogle = async () => {
    if (isDemoMode()) {
      setDemoLoading(true);
      const { demoAuth } = await import("../services/firebase");
      const result = await demoAuth.signInWithGoogle();
      if (result.user) {
        setDemoUser(result.user);
      }
      setDemoLoading(false);
      return result;
    } else {
      const { signInWithGoogle } = await import("../services/firebase");
      return await signInWithGoogle();
    }
  };

  const loginWithGithub = async () => {
    if (isDemoMode()) {
      setDemoLoading(true);
      const { demoAuth } = await import("../services/firebase");
      const result = await demoAuth.signInWithGithub();
      if (result.user) {
        setDemoUser(result.user);
      }
      setDemoLoading(false);
      return result;
    } else {
      const { signInWithGithub } = await import("../services/firebase");
      return await signInWithGithub();
    }
  };

  const logout = async () => {
    if (isDemoMode()) {
      setDemoUser(null);
      return { success: true, error: null };
    } else {
      const { logout: firebaseLogout } = await import("../services/firebase");
      return await firebaseLogout();
    }
  };

  const resetPassword = async (email: string) => {
    if (isDemoMode()) {
      // Simulate password reset in demo mode
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, error: null };
    } else {
      const { resetPassword: firebaseResetPassword } = await import(
        "../services/firebase"
      );
      return await firebaseResetPassword(email);
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading: isLoading,
    login,
    signup,
    loginWithGoogle,
    loginWithGithub,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
