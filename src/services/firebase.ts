// Updated for TypeScript migration
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  // For development - you'll need to replace these with actual Firebase project config
  apiKey: "demo-api-key",
  authDomain: "optimizecode-ai.firebaseapp.com",
  projectId: "optimizecode-ai",
  storageBucket: "optimizecode-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

const githubProvider = new GithubAuthProvider();
githubProvider.setCustomParameters({
  prompt: "consent",
});

export { googleProvider, githubProvider };

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Google sign in error:", error);
    return { user: null, error: error.message };
  }
};

export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("GitHub sign in error:", error);
    return { user: null, error: error.message };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Email sign in error:", error);
    let errorMessage = "Sign in failed. Please try again.";

    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "No account found with this email address.";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password. Please try again.";
        break;
      case "auth/invalid-email":
        errorMessage = "Please enter a valid email address.";
        break;
      case "auth/user-disabled":
        errorMessage = "This account has been disabled.";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many failed attempts. Please try again later.";
        break;
      default:
        errorMessage = error.message;
    }

    return { user: null, error: errorMessage };
  }
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string,
) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Update user profile with display name
    if (result.user && displayName) {
      await updateProfile(result.user, { displayName });
    }

    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Email sign up error:", error);
    let errorMessage = "Sign up failed. Please try again.";

    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "An account with this email already exists.";
        break;
      case "auth/invalid-email":
        errorMessage = "Please enter a valid email address.";
        break;
      case "auth/weak-password":
        errorMessage = "Password should be at least 6 characters.";
        break;
      default:
        errorMessage = error.message;
    }

    return { user: null, error: errorMessage };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Password reset error:", error);
    let errorMessage = "Password reset failed. Please try again.";

    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "No account found with this email address.";
        break;
      case "auth/invalid-email":
        errorMessage = "Please enter a valid email address.";
        break;
      default:
        errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};

// Demo mode fallback for development
export const isDemoMode = () => {
  return firebaseConfig.apiKey === "demo-api-key";
};

// Demo authentication (for development when Firebase isn't configured)
export const demoAuth = {
  signInWithEmail: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === "demo@optimizecode.ai" && password === "demo123") {
      const mockUser = {
        uid: "demo-user-123",
        email: "demo@optimizecode.ai",
        displayName: "Demo User",
        photoURL: null,
        emailVerified: true,
      } as User;

      return { user: mockUser, error: null };
    } else {
      return {
        user: null,
        error:
          "Invalid email or password. Try demo@optimizecode.ai with password: demo123",
      };
    }
  },

  signUpWithEmail: async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser = {
      uid: `demo-user-${Date.now()}`,
      email,
      displayName,
      photoURL: null,
      emailVerified: false,
    } as User;

    return { user: mockUser, error: null };
  },

  signInWithGoogle: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser = {
      uid: "google-demo-user",
      email: "user@gmail.com",
      displayName: "Google User",
      photoURL: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      emailVerified: true,
    } as User;

    return { user: mockUser, error: null };
  },

  signInWithGithub: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser = {
      uid: "github-demo-user",
      email: "user@github.com",
      displayName: "GitHub User",
      photoURL: "https://github.com/identicons/user.png",
      emailVerified: true,
    } as User;

    return { user: mockUser, error: null };
  },
};

export default app;
