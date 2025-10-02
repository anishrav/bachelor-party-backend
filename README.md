# Bachelor Party Backend

A Node.js TypeScript backend API for the Bachelor Party application with MongoDB database integration.

## 🚀 Features

- **TypeScript** - Type-safe development
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Environment Configuration** - Flexible configuration management
- **Security** - Helmet for security headers, CORS support
- **Logging** - Morgan for HTTP request logging
- **Development Tools** - Nodemon for auto-restart, ESLint for code quality

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **MongoDB Atlas Account** (Free tier available)

### Setting up MongoDB Atlas (Recommended)

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and sign up
2. **Create Cluster**: Choose M0 Sandbox (Free tier)
3. **Database User**: Create a database user with username/password
4. **Network Access**: Add your IP address (or 0.0.0.0/0 for development)
5. **Get Connection String**: Copy from "Connect your application" → "Node.js"

For detailed setup instructions, see [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)

### Alternative: Local MongoDB Installation

If you prefer local MongoDB installation:

#### macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### Ubuntu/Debian
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Windows
Download and install from [MongoDB Community Server](https://www.mongodb.com/try/download/community)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bachelor-party-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your MongoDB Atlas connection string:
   ```env
   PORT=8000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bachelor-party-db?retryWrites=true&w=majority
   MONGODB_TEST_URI=mongodb+srv://username:password@cluster.mongodb.net/bachelor-party-test-db?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:8000
   API_VERSION=v1
   API_PREFIX=/api
   ```

4. **Set up MongoDB Atlas** (if not done already)
   - Follow the steps in [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)
   - Update your `.env` file with the Atlas connection string

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Other Scripts
```bash
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm test             # Run tests
```

## 📡 API Endpoints

### Health Check
- **GET** `/health` - Server health status

### API Base
- **GET** `/` - Welcome message and API information
- **GET** `/api/v1` - API status and version info

## 🗂️ Project Structure

```
src/
├── config/           # Configuration files
│   ├── index.ts      # Main configuration
│   └── database.ts   # MongoDB connection
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

## 🔧 Configuration

The application uses environment variables for configuration. Key settings:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production/test)
- `MONGODB_URI` - MongoDB connection string
- `CORS_ORIGIN` - Allowed CORS origins
- `JWT_SECRET` - JWT signing secret (change in production!)

## 🗄️ Database

The application connects to MongoDB using Mongoose ODM. The database connection is managed through a singleton pattern for optimal performance.

### Database Features
- Connection pooling
- Automatic reconnection
- Graceful shutdown handling
- Environment-specific database selection (test vs production)

## 🧪 Testing

```bash
npm test
```

## 📝 Development

### Adding New Features

1. **Models**: Add Mongoose schemas in `src/models/`
2. **Controllers**: Add business logic in `src/controllers/`
3. **Routes**: Define API endpoints in `src/routes/`
4. **Middleware**: Add custom middleware in `src/middleware/`

### Code Style

The project uses ESLint for code quality. Run `npm run lint` to check for issues and `npm run lint:fix` to automatically fix them.

## 🚀 Deployment

1. Build the application: `npm run build`
2. Set production environment variables
3. Start the application: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
