# Google OAuth Setup Guide

## Overview

Google Sign-In has been implemented to create user accounts. After successful authentication, it automatically calls `createUser` to create a new user in the database.

## Authentication Flow

```
Frontend (localhost:3000)
    ↓
    User clicks "Sign in with Google"
    ↓
Backend: GET /api/v1/auth/google (localhost:8000)
    ↓
Google OAuth (user authenticates)
    ↓
Backend: GET /api/v1/auth/google/callback
    ↓
    Creates user via createUser logic
    ↓
Frontend: Redirects to /auth/success (localhost:3000)
```

## Setup Instructions

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure the OAuth consent screen if prompted
6. Select **Web application** as the application type
7. Add authorized redirect URIs:
   - `http://localhost:8000/api/v1/auth/google/callback` (for development)
   - Add production URL when deploying
8. Copy the **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Add these to your `.env` file:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/auth/google/callback

# Frontend URL (for redirects after auth)
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

### 3. Frontend Integration

In your React/Next.js frontend, create a simple button to initiate Google Sign-In:

```javascript
// Simple redirect approach
const handleGoogleSignIn = () => {
  window.location.href = 'http://localhost:8000/api/v1/auth/google';
};

// In your component
<button onClick={handleGoogleSignIn}>
  Sign in with Google
</button>
```

### 4. Handle Success/Failure in Frontend

Create these routes in your frontend:

**Success Route** (`/auth/success`):
```javascript
// This page is shown after successful authentication
// The session cookie is automatically set
useEffect(() => {
  // Fetch the current user to get their details
  fetch('http://localhost:8000/api/v1/auth/me', {
    credentials: 'include' // Important: includes cookies
  })
    .then(res => res.json())
    .then(data => {
      console.log('Authenticated user:', data);
      // Redirect to dashboard or home page
      navigate('/dashboard');
    });
}, []);
```

**Failure Route** (`/auth/failure`):
```javascript
// This page is shown if authentication fails
// Show error message and allow user to retry
```

### 5. Making Authenticated Requests

After successful authentication, include credentials in all API requests:

```javascript
// Fetch with credentials
fetch('http://localhost:8000/api/v1/auth/me', {
  credentials: 'include' // This sends the session cookie
})
  .then(res => res.json())
  .then(data => console.log('Current user:', data));

// Axios example
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true // Enable cookies
});

api.get('/auth/me')
  .then(res => console.log('Current user:', res.data));
```

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/auth/google` | Initiates Google OAuth flow |
| GET | `/api/v1/auth/google/callback` | Google OAuth callback (automatic) |
| GET | `/api/v1/auth/me` | Get current authenticated user |
| POST | `/api/v1/auth/logout` | Logout user |
| GET | `/api/v1/auth/failure` | Authentication failure redirect |

### Example: Get Current User

```bash
curl http://localhost:8000/api/v1/auth/me \
  -H "Cookie: connect.sid=your-session-cookie"
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "googleId": "...",
    "picture": "https://...",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "message": "Current user retrieved successfully",
  "timestamp": "2024-10-02T...",
  "requestId": "..."
}
```

### Example: Logout

```bash
curl -X POST http://localhost:8000/api/v1/auth/me/logout \
  -H "Cookie: connect.sid=your-session-cookie"
```

## How It Works

1. **User Model Updated**: Added `googleId` and `picture` fields to support Google authentication
2. **Passport Strategy**: Configured Google OAuth 2.0 strategy
3. **Auto-Create User**: When a new Google user signs in:
   - Extracts profile info (name, email, picture)
   - Calls `createUser` logic to create a new user in the database
   - Associates the Google ID with the user
4. **Session Management**: Uses express-session to maintain user login state
5. **Frontend Redirect**: After authentication, redirects to frontend with session cookie

## Troubleshooting

### "Authentication failed" error
- Check that your Google Client ID and Secret are correct
- Verify the callback URL matches exactly in Google Console
- Make sure the redirect URI is authorized in Google Console

### Session not persisting
- Ensure `credentials: 'include'` or `withCredentials: true` in frontend requests
- Check that CORS origin is set correctly
- In production, make sure `secure: true` for cookies over HTTPS

### User not being created
- Check MongoDB connection
- View server logs for any validation errors
- Ensure required fields (firstName, lastName, email) are being extracted from Google profile

## Production Deployment

When deploying to production:

1. Update environment variables:
   ```bash
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/v1/auth/google/callback
   FRONTEND_URL=https://yourfrontend.com
   CORS_ORIGIN=https://yourfrontend.com
   ```

2. Add production callback URL to Google Console

3. Generate secure secrets:
   ```bash
   SESSION_SECRET=generate-a-secure-random-string
   JWT_SECRET=generate-another-secure-random-string
   ```

4. Enable secure cookies (automatically enabled when NODE_ENV=production)

