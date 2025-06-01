// API service for communicating with Express.js backend
import { SubscriptionPlan } from "../types/user";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const USE_REAL_BACKEND = import.meta.env.VITE_USE_REAL_BACKEND === "true";

// Get authentication token from Firebase
const getAuthToken = async (): Promise<string | null> => {
  if (!USE_REAL_BACKEND) return "demo-token";

  try {
    // Get current user's ID token from Firebase
    const { getAuth } = await import("firebase/auth");
    const auth = getAuth();

    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }

    return null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

// Generic API request helper
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<any> => {
  const token = await getAuthToken();

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include",
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

export interface OptimizeCodeRequest {
  code: string;
  language?: string;
  optimizationType?:
    | "performance"
    | "readability"
    | "security"
    | "best_practices";
}

export interface OptimizeCodeResponse {
  success: boolean;
  original: string;
  optimized: string;
  insights: {
    linesReduced: number;
    sizeReduction: string;
    originalSize: number;
    optimizedSize: number;
    language: string;
    improvements: string[];
  };
  language: string;
  optimizationType: string;
  timestamp: string;
}

export interface BatchOptimizeRequest {
  files: Array<{
    name: string;
    content: string;
  }>;
  optimizationType?:
    | "performance"
    | "readability"
    | "security"
    | "best_practices";
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  subscription: {
    plan: SubscriptionPlan;
    status: string;
    startDate: string;
    cancelAtPeriodEnd: boolean;
  };
  usage: {
    optimizationsToday: number;
    totalOptimizations: number;
    currentDayStart: string;
  };
  limits: {
    optimizationsPerDay: number;
    maxFileUploads: number;
    maxPasteCharacters: number;
    maxFileSize: number;
    prioritySupport: boolean;
    advancedFeatures: boolean;
  };
}

export const apiService = {
  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    if (!USE_REAL_BACKEND) {
      return { status: "OK", timestamp: new Date().toISOString() };
    }

    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  // Authentication
  async register(email: string, password: string, displayName?: string) {
    if (!USE_REAL_BACKEND) {
      return {
        message: "Demo registration successful",
        user: { uid: "demo", email },
      };
    }

    return apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, displayName }),
    });
  },

  async login(email: string, password: string) {
    if (!USE_REAL_BACKEND) {
      return {
        message: "Demo login successful",
        token: "demo-token",
        user: { uid: "demo", email },
      };
    }

    return apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async verifyToken(token: string) {
    if (!USE_REAL_BACKEND) {
      return {
        message: "Token valid",
        user: { uid: "demo", email: "demo@test.com" },
      };
    }

    return apiRequest("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },

  // User management
  async getUserProfile(): Promise<{ profile: UserProfile }> {
    if (!USE_REAL_BACKEND) {
      return {
        profile: {
          uid: "demo",
          email: "demo@test.com",
          displayName: "Demo User",
          subscription: {
            plan: "free",
            status: "active",
            startDate: new Date().toISOString(),
            cancelAtPeriodEnd: false,
          },
          usage: {
            optimizationsToday: 0,
            totalOptimizations: 0,
            currentDayStart: new Date().toISOString(),
          },
          limits: {
            optimizationsPerDay: 10,
            maxFileUploads: 2,
            maxPasteCharacters: 10000,
            maxFileSize: 1,
            prioritySupport: false,
            advancedFeatures: false,
          },
        },
      };
    }

    return apiRequest("/api/user/profile");
  },

  async updateProfile(
    updates: Partial<{ displayName: string; email: string }>,
  ) {
    if (!USE_REAL_BACKEND) {
      return { message: "Profile updated" };
    }

    return apiRequest("/api/user/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  async getUsage() {
    if (!USE_REAL_BACKEND) {
      return {
        usage: { optimizationsToday: 0, totalOptimizations: 0 },
        limits: { optimizationsPerDay: 10 },
        subscription: { plan: "free", status: "active" },
      };
    }

    return apiRequest("/api/user/usage");
  },

  async trackUsage() {
    if (!USE_REAL_BACKEND) {
      return {
        success: true,
        usage: { used: 1, remaining: 9, total: 10, isUnlimited: false },
      };
    }

    return apiRequest("/api/user/track-usage", { method: "POST" });
  },

  async changePlan(plan: SubscriptionPlan) {
    if (!USE_REAL_BACKEND) {
      return { message: `Changed to ${plan} plan`, plan };
    }

    return apiRequest("/api/user/change-plan", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
  },

  // Code optimization
  async optimizeCode(
    request: OptimizeCodeRequest,
  ): Promise<OptimizeCodeResponse> {
    if (!USE_REAL_BACKEND) {
      // Mock response for demo
      const mockOptimized = request.code
        .replace(/var /g, "const ")
        .replace(/function /g, "const ");
      return {
        success: true,
        original: request.code,
        optimized: mockOptimized,
        insights: {
          linesReduced: 2,
          sizeReduction: "10%",
          originalSize: request.code.length,
          optimizedSize: mockOptimized.length,
          language: request.language || "javascript",
          improvements: ["Improved variable declarations", "Modern syntax"],
        },
        language: request.language || "javascript",
        optimizationType: request.optimizationType || "performance",
        timestamp: new Date().toISOString(),
      };
    }

    return apiRequest("/api/optimize/code", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  async batchOptimize(request: BatchOptimizeRequest) {
    if (!USE_REAL_BACKEND) {
      return {
        success: true,
        results: request.files.map((file) => ({
          fileName: file.name,
          original: file.content,
          optimized: file.content.replace(/var /g, "const "),
          insights: {
            linesReduced: 1,
            sizeReduction: "5%",
            improvements: ["Variable declarations"],
          },
          language: "javascript",
        })),
        totalFiles: request.files.length,
        timestamp: new Date().toISOString(),
      };
    }

    return apiRequest("/api/optimize/batch", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  async getOptimizationHistory(limit = 10, offset = 0) {
    if (!USE_REAL_BACKEND) {
      return { history: [], total: 0, limit, offset };
    }

    return apiRequest(`/api/optimize/history?limit=${limit}&offset=${offset}`);
  },
};

// Export for use in components
export default apiService;
