import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IUser } from '../models/User';

export class JWTUtil {
  /**
   * Generate a JWT token for a user
   * @param user - User object to encode in the token
   * @returns JWT token string
   */
  public static generateToken(user: IUser): string {
    const payload = {
      id: user._id,
      email: user.email,
      name: user.firstName + ' ' + user.lastName,
      picture: user.picture,
    };

    return jwt.sign(payload, config.jwt.secret as string, {
      expiresIn: '7D',
    });
  }

  /**
   * Verify and decode a JWT token
   * @param token - JWT token string
   * @returns Decoded token payload
   */
  public static verifyToken(token: string): any {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
