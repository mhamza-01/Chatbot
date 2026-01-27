import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

const authenticate = (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided. Authentication required.' });
    }

    
    const token = authHeader.replace('Bearer ', '');

    
    const decoded = jwt.verify(token, JWT_SECRET);

   
    req.userId = decoded.userId;
    
    console.log('✅ Authenticated user:', req.userId);
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

export default authenticate;