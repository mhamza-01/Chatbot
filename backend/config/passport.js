import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('🔍 Google Profile:', profile);

       
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          console.log('✅ Existing Google user found:', user.email);
          return done(null, user);
        }

        
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          
          user.googleId = profile.id;
          user.profilePicture = profile.photos[0]?.value;
          user.authProvider = 'google';
          await user.save();
          
          console.log('🔗 Linked Google to existing account:', user.email);
          return done(null, user);
        }

       
        user = new User({
          googleId: profile.id,
          username: profile.displayName || profile.emails[0].value.split('@')[0],
          email: profile.emails[0].value,
          profilePicture: profile.photos[0]?.value,
          authProvider: 'google',
        });

        await user.save();
        console.log('✅ New Google user created:', user.email);
        
        done(null, user);
      } catch (error) {
        console.error('❌ Google Auth Error:', error);
        done(error, null);
      }
    }
  )
);

export default passport;