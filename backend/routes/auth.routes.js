import express from 'express';
import passport from 'passport';
import { register, login, logout, getCurrentUser } from '../controllers/authController.js';
import { googleAuth, googleAuthCallback } from '../controllers/googleAuthController.js';
import authenticate from '../middlewares/auth.js';

const router = express.Router();

// Local auth routes
router.post('/register', register);
router.post('/login', login);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
  }),
  googleAuthCallback
);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);

export default router;