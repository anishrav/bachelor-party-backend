import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User';

export class UserController {
  // Create a new user
  public static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, lastName, email, phone } = req.body;

      const user = new User({
        firstName,
        lastName,
        email,
        phone
      });

      const savedUser = await user.save();

      res.status(201).json(savedUser);
    } catch (error: any) {
      next(error);
    }
  }

  // Get all users
  public static async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await User.find().sort({ createdAt: -1 });

      res.status(200).json(users);
    } catch (error: any) {
      next(error);
    }
  }

  // Get user by ID
  public static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findById(id);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error: any) {
      next(error);
    }
  }

  // Update user
  public static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error: any) {
      next(error);
    }
  }

  // Delete user
  public static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndDelete(id);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  // Get RSVP status
  public static async getRSVPStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findById(id);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Type assertion to inform TypeScript that user has hasRSVPd property
      res.status(200).json({ hasRSVPd: (user as any).hasRSVPd });
    } catch (error: any) {
      next(error);
    }
  }

  // Update RSVP status
  public static async updateRSVPStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { hasRSVPd } = req.body;

      if (typeof hasRSVPd !== 'boolean') {
        res.status(400).json({ error: 'hasRSVPd must be a boolean value' });
        return;
      }

      const user = await User.findByIdAndUpdate(
        id,
        { hasRSVPd },
        { new: true, runValidators: true }
      );

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error: any) {
      next(error);
    }
  }
}

