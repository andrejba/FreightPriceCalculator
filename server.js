require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Session Middleware
app.use(session({
  secret: '2801',
  resave: false,
  saveUninitialized: true,
}));

// Initialize Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/index.html'));
});

// Serve static files
app.use(express.static(path.join(__dirname, '.')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Configure Local Strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }
      bcrypt.compare(password, user.password, function(err, isMatch) {
        if (err) {
          return done(err);
        }
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      });
    });
  }
));

// Serialization and Deserialization
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// API endpoint for calculating freight
app.post('/api/calculateFreight', (req, res) => {
  const { weight, distance } = req.body;

  // Define the factors
  const basePrice = 50;
  const weightFactor = 0.10;
  const distanceFactor = 0.05;

  // Calculate the freight cost
  const freightCost = basePrice + (weightFactor * weight) + (distanceFactor * distance);

  res.json({ success: true, freightCost });
});

// Login Endpoint
app.post('/api/login', passport.authenticate('local', {
  successRedirect: '/login-success',
  failureRedirect: '/login-failure'
}));

// Registration Endpoint
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  User.findOne({ username })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      
      // Hash the password
      const saltRounds = 10;
      return bcrypt.hash(password, saltRounds);
    })
    .then(hash => {
      // Save the new user in MongoDB
      const newUser = new User({ username, password: hash });
      return newUser.save();
    })
    .then(() => {
      return res.json({ message: 'User registered successfully' });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: 'Failed to register user' });
    });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000/');
});
