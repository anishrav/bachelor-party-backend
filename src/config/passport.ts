import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { config } from './index';
import { User, IUser } from '../models/User';

// Serialize user for the session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL,
      scope: ['profile', 'email'],
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User exists, return the user
          return done(null, user);
        }

        // Check if user exists with this email
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
        if (email) {
          user = await User.findOne({ email });
          
          if (user) {
            // User exists with email, update with Google ID
            user.googleId = profile.id;
            user.picture = profile.photos && profile.photos[0] ? profile.photos[0].value : user.picture;
            await user.save();
            return done(null, user);
          }
        }

        // User doesn't exist, create new user (calling createUser logic)
        const firstName = profile.name?.givenName || '';
        const lastName = profile.name?.familyName || '';
        const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : '';

        if (!email || !firstName || !lastName) {
          return done(new Error('Missing required user information from Google profile'), false);
        }

        const newUser = new User({
          firstName,
          lastName,
          email,
          googleId: profile.id,
          picture,
        });

        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (error) {
        return done(error as Error, false);
      }
    }
  )
);

export default passport;

