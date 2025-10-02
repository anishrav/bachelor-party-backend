import { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/AuthController';
import { config } from '../config';

const router = Router();

// @route   GET /auth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/api/v1/auth/failure',
    session: true 
  }),
  AuthController.googleCallback
);

// @route   GET /auth/failure
// @desc    Authentication failure endpoint
// @access  Public
router.get('/failure', (req, res) => {
  // Redirect to frontend with error
  res.redirect(`${config.frontend.url}/auth/failure`);
});

// @route   GET /auth/me
// @desc    Get current authenticated user
// @access  Private
router.get('/me', AuthController.getCurrentUser);

// @route   POST /auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', AuthController.logout);

export default router;


