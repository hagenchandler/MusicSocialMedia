// server.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const AppleStrategy = require('passport-apple');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(passport.initialize());

// Spotify authentication
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/spotify/callback',
    },
    (accessToken, refreshToken, expires_in, profile, done) => {
      // Handle Spotify authentication
      // Save user data to your database
      return done(null, profile);
    }
  )
);

app.get('/auth/spotify', passport.authenticate('spotify'));
app.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Apple Music authentication
passport.use(
  new AppleStrategy(
    {
      clientID: process.env.APPLE_MUSIC_KEY_ID,
      teamID: process.env.APPLE_MUSIC_TEAM_ID,
      callbackURL: 'http://localhost:3001/auth/apple/callback',
      key: fs.readFileSync(process.env.APPLE_MUSIC_PRIVATE_KEY_PATH),
      scope: ['user.email'],
    },
    (accessToken, refreshToken, expires_in, profile, done) => {
      // Handle Apple Music authentication
      // Save user data to your database
      return done(null, profile);
    }
  )
);

app.get('/auth/apple', passport.authenticate('apple'));
app.get(
  '/auth/apple/callback',
  passport.authenticate('apple', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
