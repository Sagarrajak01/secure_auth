const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/userModel');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback',
      scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const githubId = profile.id;
        const name = profile.displayName || profile.username || 'GitHub User';
        
        // Extract primary email safely
        let email = null;
        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value;
        }
        
        const avatar = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;

        // Check if user already exists with this github_id
        let user = User.findByGithubId(githubId);

        if (user) {
          return done(null, user);
        }

        // If not found by github_id, check if user exists with the same email
        if (email) {
          user = User.findByEmail(email);
          if (user) {
            // Link github_id to existing account
            const db = require('./db');
            const stmt = db.prepare('UPDATE users SET github_id = ?, avatar = COALESCE(?, avatar), updated_at = CURRENT_TIMESTAMP WHERE id = ?');
            stmt.run(githubId, avatar, user.id);
            user = User.findById(user.id);
            return done(null, user);
          }
        }

        // Otherwise, create a brand new user
        const allUsers = User.findAll();
        const role = allUsers.length === 0 ? 'admin' : 'user';

        user = User.create({
          name,
          email: email || `github_${githubId}@secure_auth.local`,
          passwordHash: null, // OAuth users don't have local password hashes
          githubId,
          avatar,
          role
        });

        return done(null, user);
      } catch (error) {
        console.error('Passport GitHub Strategy error:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  try {
    const user = User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;