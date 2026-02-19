import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.model.js";

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email
            });
          } else {
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
          }

          return done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};

export default passport;
