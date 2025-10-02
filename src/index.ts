import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import { config } from './config';
import DatabaseConnection from './config/database';
import passport from './config/passport';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = Number(config.port);
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS middleware
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: true,
    }));

    // Logging middleware
    this.app.use(morgan('combined'));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Session middleware (required for passport)
    this.app.use(session({
      secret: config.session.secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: config.nodeEnv === 'production', // Use secure cookies in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }));

    // Passport middleware
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.nodeEnv,
        database: DatabaseConnection.getInstance().getConnectionStatus() ? 'Connected' : 'Disconnected',
      });
    });

    // User routes
    this.app.use(`${config.api.prefix}/${config.api.version}`, userRoutes);

    // Auth routes
    this.app.use(`${config.api.prefix}/${config.api.version}/auth`, authRoutes);

    // API info endpoint (must come after specific routes)
    this.app.get(`${config.api.prefix}/${config.api.version}`, (req: Request, res: Response) => {
      res.json({
        message: 'Bachelor Party API',
        version: config.api.version,
        status: 'Running',
        timestamp: new Date().toISOString(),
      });
    });

    // Root endpoint
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        message: 'Welcome to Bachelor Party Backend API',
        version: config.api.version,
        documentation: `${config.api.prefix}/${config.api.version}`,
        health: '/health',
      });
    });

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method,
      });
    });
  }

  private initializeErrorHandling(): void {
    // Global error handler
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('Global error handler:', error);
      
      res.status(500).json({
        error: 'Internal server error',
        message: config.nodeEnv === 'development' ? error.message : 'Something went wrong',
        timestamp: new Date().toISOString(),
      });
    });
  }

  public async start(): Promise<void> {
    try {
      // Connect to MongoDB
      await DatabaseConnection.getInstance().connect();

      // Start the server
      this.app.listen(this.port, () => {
        console.log(`🚀 Server running on port ${this.port}`);
        console.log(`📊 Environment: ${config.nodeEnv}`);
        console.log(`🔗 API Base URL: http://localhost:${this.port}${config.api.prefix}/${config.api.version}`);
        console.log(`❤️  Health Check: http://localhost:${this.port}/health`);
      });

    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public getApp(): Application {
    return this.app;
  }
}

// Start the server
const server = new Server();
server.start().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});

export default server;
