# Google OAuth Setup Guide

This guide will help you set up Google Sign-In for your Bachelor Party Backend application.

## Overview

The application now supports Google OAuth authentication. When a user signs in with Google for the first time, a new user account is automatically created by calling the `createUser` logic with their Google profile information.

## Setup Instructions

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API or Google Identity Services

### 2. Create OAuth 2.0 Credentials

1. In your Google Cloud Console, navigate to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Select **Web application**
4. Configure the OAuth consent screen if prompted
5. Add authorized redirect URIs:
   - For development: `http://localhost:8000/api/v1/auth/google/callback`
   - For production: `https://yourdomain.com/api/v1/auth/google/callback`
6. Click **Create** and note down your **Client ID** and **Client Secret**

### 3. Configure Environment Variables

Add the following to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/auth/google/callback

# Session Configuration (required for passport)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# CORS Configuration (allow your frontend)
CORS_ORIGIN=http://localhost:3000
```

**Important:** Replace the placeholder values with your actual Google OAuth credentials.

## API Endpoints

### Authentication Endpoints

#### 1. Initiate Google Sign-In
```
GET /api/v1/auth/google
```
Redirects the user to Google's OAuth consent screen.

**Usage:**
- Redirect users to this endpoint from your frontend
- Example: `<a href="http://localhost:8000/api/v1/auth/google">Sign in with Google</a>`

#### 2. Google OAuth Callback
```
GET /api/v1/auth/google/callback
```
Handles the callback from Google after authentication.

**Flow:**
- If user exists: Authenticates and returns user data
- If user is new: Creates a new user account by calling `createUser` logic, then authenticates

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "user-id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@gmail.com",
    "googleId": "google-user-id",
    "picture": "https://lh3.googleusercontent.com/...",
    "createdAt": "2023-12-01T00:00:00.000Z",
    "updatedAt": "2023-12-01T00:00:00.000Z"
  },
  "message": "User created and authenticated successfully",
  "timestamp": "2023-12-01T00:00:00.000Z",
  "requestId": "abc123"
}
```

#### 3. Get Current User
```
GET /api/v1/auth/me
```
Returns the currently authenticated user's information.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user-id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@gmail.com",
    "googleId": "google-user-id",
    "picture": "https://lh3.googleusercontent.com/..."
  },
  "message": "Current user retrieved successfully",
  "timestamp": "2023-12-01T00:00:00.000Z"
}
```

#### 4. Logout
```
POST /api/v1/auth/logout
```
Logs out the current user and destroys the session.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "timestamp": "2023-12-01T00:00:00.000Z"
}
```

#### 5. Authentication Failure
```
GET /api/v1/auth/failure
```
Endpoint for handling authentication failures.

## Frontend Integration

### React Example

```javascript
// Login button
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:8000/api/v1/auth/google';
};

// Check if user is authenticated
const checkAuth = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/auth/me', {
      credentials: 'include', // Important: Include cookies
    });
    const data = await response.json();
    if (data.success) {
      setUser(data.data);
    }
  } catch (error) {
    console.error('Not authenticated');
  }
};

// Logout
const handleLogout = async () => {
  try {
    await fetch('http://localhost:8000/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  } catch (error) {
    console.error('Logout failed');
  }
};
```

### Important Frontend Notes

1. **Credentials:** Always include `credentials: 'include'` in fetch requests to send/receive cookies
2. **CORS:** Make sure your frontend URL is set in the `CORS_ORIGIN` environment variable
3. **Redirect Flow:** After Google authentication, you may want to redirect users back to your frontend:
   - Modify the `AuthController.googleCallback` to redirect to your frontend with a token or session

## Database Schema Updates

The User model now includes the following additional fields:

```typescript
interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  googleId?: string;        // Google user ID (unique)
  picture?: string;         // Google profile picture URL
  createdAt: Date;
  updatedAt: Date;
}
```

## How It Works

### Authentication Flow

1. User clicks "Sign in with Google" on your frontend
2. Frontend redirects to `/api/v1/auth/google`
3. User is redirected to Google's consent screen
4. User approves and is redirected back to `/api/v1/auth/google/callback`
5. Backend receives Google profile data:
   - **If user exists:** Authenticates the user and returns their data
   - **If user is new:** Creates a new user using the `createUser` logic with:
     - `