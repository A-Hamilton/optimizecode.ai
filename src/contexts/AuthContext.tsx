// Updated for TypeScript migration
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, isDemoMode } from "../services/firebase";
import { UserProfile, SubscriptionPlan } from "../types/user";
import { UserService } from "../services/userService";

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
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
  changePlan: (
    newPlan: SubscriptionPlan,
  ) => Promise<{ success: boolean; error: string | null }>;
  trackUsage: () => Promise<{
    success: boolean;
    remainingFiles: number;
    error?: string;
  }>;
  refreshProfile: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoUser, setDemoUser] = useState<User | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Use Firebase auth in production, demo auth in development
  const currentUser = isDemoMode() ? demoUser : user;
  const isLoading = isDemoMode() ? demoLoading : loading;

  // Listen to Firebase auth state changes (only in production mode)
  useEffect(() => {
    if (!isDemoMode() && auth) {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          setUser(user);
          if (user) {
            await loadUserProfile(user.uid);
          } else {
            setUserProfile(null);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Auth state error:", error);
          setLoading(false);
        },
      );

      return () => unsubscribe();
    } else {
      // In demo mode, we manage loading state manually
      setLoading(false);
    }
  }, []);

  // Load or create user profile
  const loadUserProfile = async (uid: string) => {
    try {
      let profile = await UserService.getUserProfile(uid);

      // If no profile exists, create one (new user)
      if (!profile && currentUser) {
        profile = await UserService.createUserProfile(currentUser, "free");
      }

      if (profile) {
        // Update last login time
        await UserService.updateLastLogin(uid);
        profile.lastLoginAt = new Date();
        setUserProfile(profile);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    if (currentUser) {
      await loadUserProfile(currentUser.uid);
    }
  };

  const login = async (email: string, password: string) => {
    if (isDemoMode()) {
      setDemoLoading(true);
      const { demoAuth } = await import("../services/firebase");
      const result = await demoAuth.signInWithEmail(email, password);
      if (result.user) {
        setDemoUser(result.user);
        await loadUserProfile(result.user.uid);
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
        await UserService.createUserProfile(result.user, "free");
        await loadUserProfile(result.user.uid);
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
        // Check if profile exists, create if new user
        let profile = await UserService.getUserProfile(result.user.uid);
        if (!profile) {
          await UserService.createUserProfile(result.user, "free");
        }
        await loadUserProfile(result.user.uid);
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
        // Check if profile exists, create if new user
        let profile = await UserService.getUserProfile(result.user.uid);
        if (!profile) {
          await UserService.createUserProfile(result.user, "free");
        }
        await loadUserProfile(result.user.uid);
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
      setUserProfile(null);
      return { success: true, error: null };
    } else {
      const { logout: firebaseLogout } = await import("../services/firebase");
      const result = await firebaseLogout();
      if (result.success) {
        setUserProfile(null);
      }
      return result;
    }
  };

  // Change user's subscription plan
  const changePlan = async (newPlan: SubscriptionPlan) => {
    if (!currentUser) {
      return { success: false, error: "User not authenticated" };
    }

    try {
      const updatedProfile = await UserService.changePlan(
        currentUser.uid,
        newPlan,
      );
      if (updatedProfile) {
        setUserProfile(updatedProfile);
        return { success: true, error: null };
      } else {
        return { success: false, error: "Failed to update plan" };
      }
    } catch (error) {
      return { success: false, error: "Failed to update plan" };
    }
  };

  // Track optimization usage
  const trackUsage = async () => {
    if (!currentUser) {
      return {
        success: false,
        remainingOptimizations: 0,
        error: "User not authenticated",
      };
    }

    try {
      const result = await UserService.trackUsage(currentUser.uid);

      // Refresh user profile to get updated usage
      if (result.success) {
        await refreshProfile();
      }

      return result;
    } catch (error) {
      return {
        success: false,
        remainingOptimizations: 0,
        error: "Failed to track usage",
      };
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
    userProfile,
    loading: isLoading,
    login,
    signup,
    loginWithGoogle,
    loginWithGithub,
    logout,
    resetPassword,
    changePlan,
    trackUsage,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
