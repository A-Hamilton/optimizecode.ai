const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  if (admin.apps.length === 0) {
    try {
      // Initialize with environment variables
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri:
          process.env.FIREBASE_AUTH_URI ||
          "https://accounts.google.com/o/oauth2/auth",
        token_uri:
          process.env.FIREBASE_TOKEN_URI ||
          "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:
          "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`,
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/`,
      });

      console.log("✅ Firebase Admin SDK initialized successfully");
    } catch (error) {
      console.error(
        "❌ Firebase Admin SDK initialization failed:",
        error.message,
      );

      // Fallback to demo mode if Firebase fails
      console.log("🔄 Falling back to demo mode...");
      global.FIREBASE_DEMO_MODE = true;
    }
  }

  return admin;
};

// Firestore database instance
const getFirestore = () => {
  if (global.FIREBASE_DEMO_MODE) {
    // Return mock Firestore for demo mode
    return {
      collection: () => ({
        doc: () => ({
          get: async () => ({ exists: false, data: () => null }),
          set: async () => ({}),
          update: async () => ({}),
          delete: async () => ({}),
        }),
        add: async () => ({ id: "demo-id" }),
        where: () => ({
          get: async () => ({ docs: [] }),
        }),
        get: async () => ({ docs: [] }),
      }),
    };
  }

  return admin.firestore();
};

// Authentication instance
const getAuth = () => {
  if (global.FIREBASE_DEMO_MODE) {
    // Return mock Auth for demo mode
    return {
      verifyIdToken: async (token) => {
        if (token === "demo-token") {
          return {
            uid: "demo-user-id",
            email: "demo@optimizecode.ai",
            name: "Demo User",
          };
        }
        throw new Error("Invalid demo token");
      },
      createUser: async (userData) => ({ uid: "demo-user-id", ...userData }),
      updateUser: async (uid, userData) => ({ uid, ...userData }),
      deleteUser: async (uid) => ({ uid }),
    };
  }

  return admin.auth();
};

// User management functions
const userService = {
  // Verify Firebase ID token
  async verifyToken(idToken) {
    try {
      const auth = getAuth();
      const decodedToken = await auth.verifyIdToken(idToken);
      return { success: true, user: decodedToken };
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return { success: false, error: error.message };
    }
  },

  // Get user by UID
  async getUser(uid) {
    try {
      const auth = getAuth();
      const userRecord = await auth.getUser(uid);
      return { success: true, user: userRecord };
    } catch (error) {
      console.error("Get user failed:", error.message);
      return { success: false, error: error.message };
    }
  },

  // Create user profile in Firestore
  async createUserProfile(uid, profileData) {
    try {
      const db = getFirestore();
      const userRef = db.collection("users").doc(uid);

      const userProfile = {
        uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        ...profileData,
      };

      await userRef.set(userProfile);
      return { success: true, profile: userProfile };
    } catch (error) {
      console.error("Create user profile failed:", error.message);
      return { success: false, error: error.message };
    }
  },

  // Get user profile from Firestore
  async getUserProfile(uid) {
    try {
      const db = getFirestore();
      const userRef = db.collection("users").doc(uid);
      const doc = await userRef.get();

      if (!doc.exists) {
        return { success: false, error: "User profile not found" };
      }

      return { success: true, profile: doc.data() };
    } catch (error) {
      console.error("Get user profile failed:", error.message);
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  async updateUserProfile(uid, updates) {
    try {
      const db = getFirestore();
      const userRef = db.collection("users").doc(uid);

      const updateData = {
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await userRef.update(updateData);
      return { success: true };
    } catch (error) {
      console.error("Update user profile failed:", error.message);
      return { success: false, error: error.message };
    }
  },
};

// Initialize Firebase when module is loaded
initializeFirebase();

module.exports = {
  admin,
  getFirestore,
  getAuth,
  userService,
  isDemoMode: () => global.FIREBASE_DEMO_MODE === true,
};
