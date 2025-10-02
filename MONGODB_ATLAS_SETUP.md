# MongoDB Atlas Setup Guide

## Quick Setup Steps

1. **Create Atlas Account**: Go to https://www.mongodb.com/atlas and sign up
2. **Create Cluster**: Choose M0 Sandbox (Free tier)
3. **Database User**: Create user with username/password
4. **Network Access**: Add your IP address (or 0.0.0.0/0 for development)
5. **Get Connection String**: Copy the connection string from "Connect your application"

## Environment Variables

Create a `.env` file in your project root with these variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# MongoDB Atlas Configuration
# Replace with your actual Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bachelor-party-db?retryWrites=true&w=majority
MONGODB_TEST_URI=mongodb+srv://username:password@cluster.mongodb.net/bachelor-party-test-db?retryWrites=true&w=majority

# JWT Configuration (for future authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:8000

# API Configuration
API_VERSION=v1
API_PREFIX=/api
```

## Connection String Format

Your Atlas connection string should look like:
```
mongodb+srv://anishrav:8R8cTj0Q9lSStSaO@bachelor-party-cluster.xvxwn67.mongodb.net/?retryWrites=true&w=majority&appName=bachelor-party-cluster
```

Replace:
- `<username>`: Your database username
- `<password>`: Your database password
- `<cluster-name>`: Your cluster name
- `<database-name>`: Database name (e.g., bachelor-party-db)

## Testing the Connection

Once you have your `.env` file set up, run:
```bash
npm run dev
```

The server should connect to Atlas and you'll see:
```
MongoDB connected successfully to: mongodb+srv://...
🚀 Server running on port 8000
```

## Troubleshooting

- **Connection timeout**: Check your IP is whitelisted in Network Access
- **Authentication failed**: Verify username/password in connection string
- **SSL errors**: Make sure you're using the `mongodb+srv://` format

