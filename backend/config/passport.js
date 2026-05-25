const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BACKEND_URL 
        ? `${process.env.BACKEND_URL}/api/auth/google/callback`
        : "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in our db with the given profile ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // If user exists, return the user
          done(null, user);
        } else {
          // Check if there is already an account with the Google email
          const existingEmailUser = await User.findOne({
            email: profile.emails[0].value,
          });

          if (existingEmailUser) {
            // If email exists but not linked to Google, link it
            existingEmailUser.googleId = profile.id;
            user = await existingEmailUser.save();
            done(null, user);
          } else {
            // If user doesn't exist, create a new user
            const newUser = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              password: Math.random().toString(36).slice(-8), // Random password, but we won't use it for Google users
            });
            user = await newUser.save();
            done(null, user);
          }
        }
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;