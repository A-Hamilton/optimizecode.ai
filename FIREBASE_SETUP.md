# Firebase Authentication Setup Guide

This project includes Firebase Authentication with Google and GitHub OAuth providers. Currently, it runs in **demo mode** for development purposes.

## Demo Mode (Current Setup)

The application currently uses demo authentication with these test credentials:

### Email/Password Login:

- **Email**: `demo@optimizecode.ai`
- **Password**: `demo123`

### Social Login:

- **Google**: Creates a mock Google user
- **GitHub**: Creates a mock GitHub user

## Setting Up Real Firebase Authentication

To enable real Firebase authentication, follow these steps:

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard
4. Enable Authentication in the Firebase console

### 2. Enable Authentication Providers

In the Firebase console:

1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (automatically configured)
4. Enable **GitHub**:
   - Go to GitHub > Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Copy Client ID and Client Secret to Firebase

### 3. Get Firebase Configuration

1. Go to **Project Settings** > **General**
2. Scroll down to "Your apps" and click "Web app"
3. Copy the Firebase configuration object

### 4. Update Configuration

Replace the demo config in `src/services/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
};
```

### 5. Set up Authorized Domains

In Firebase Console:

1. Go to **Authentication** > **Settings** > **Authorized domains**
2. Add your development and production domains

## Environment Variables (Optional)

For production, consider using environment variables:

Create `.env` file:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
# ... other config values
```

Then update `firebase.ts` to use these variables.

## Features Included

- ✅ Email/Password Authentication
- ✅ Google OAuth
- ✅ GitHub OAuth
- ✅ Password Reset
- ✅ User Profile Management
- ✅ Protected Routes
- ✅ Persistent Login State
- ✅ Responsive Design
- ✅ Error Handling
- ✅ Loading States

## Demo Mode vs Production

| Feature        | Demo Mode    | Production                |
| -------------- | ------------ | ------------------------- |
| User Data      | Mock data    | Real Firebase users       |
| Persistence    | Session only | Firebase Auth persistence |
| Password Reset | Simulated    | Real email delivery       |
| Social OAuth   | Mock flow    | Real OAuth providers      |
| Security       | Local only   | Firebase security rules   |

## Testing

### Demo Credentials:

- Email: `demo@optimizecode.ai`
- Password: `demo123`

### Test Flows:

1. **Login** → Dashboard
2. **Sign Up** → Auto-login → Dashboard
3. **Social Login** → Dashboard
4. **Forgot Password** → Success message
5. **Logout** → Homepage

The authentication system is production-ready and will automatically switch from demo mode to real Firebase when you update the configuration!
