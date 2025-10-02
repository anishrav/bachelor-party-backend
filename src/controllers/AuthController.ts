import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
import { config } from '../config';
import { JWTUtil } from '../utils/jwt';

export class AuthController {
  // Google OAuth callback handler
  public static async googleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // User is authenticated (either existing or newly created by passport strategy)
      if (!req.user) {
        res.status(401).json({ error: 'Authentication failed' });
        return;
      }

      const user = req.user as IUser;

      // Generate JWT token
      const token = JWTUtil.generateToken(user);

      // Prepare user data for frontend
      const userData = {
        id: user._id,
        email: user.email,
        name: user.firstName + ' ' + user.lastName,
        picture: user.picture,
      };

      // Redirect to frontend with token and user data as query params
      const redirectUrl = `${config.frontend.url}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
      res.redirect(redirectUrl);
    } catch (error: any) {
      next(error);
    }
  }

  // Get current authenticated user
  public static async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.isAuthenticated() || !req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      res.status(200).json(req.user as IUser);
    } catch (error: any) {
      next(error);
    }
  }

  // Logout user
  public static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      req.logout((err) => {
        if (err) {
          return next(err);
        }

        res.status(204).send();
      });
    } catch (error: any) {
      next(error);
    }
  }
}


