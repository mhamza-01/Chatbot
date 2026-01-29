import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};


export const googleAuth = (req, res, next) => {

};

export const googleAuthCallback = (req, res) => {
  try {
    
    const user = req.user;

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
    }

    
    const token = generateToken(user._id);

    
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}`);
  } catch (error) {
    console.error('❌ Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};