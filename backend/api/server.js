import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Strategy as LocalStrategy } from 'passport-local';
import Signup from '../models/Signup.js';
import Profile from '../Routes/Profile.js';
import CreatePost from '../Routes/CreatePost.js';
import CreateCommunity from '../Routes/CreateCommunity.js';
import CreateComment from '../Routes/CreateComment.js';
import Follow from '../Routes/Follow.js';
import authenticateJWT from '../Authentication/Auth.js';

dotenv.config();

const app = express();

const port = 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors({
  origin: ['https://greddit-main.onrender.com', 'http://localhost:3000','http://localhost:5173'],

  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/profile', Profile);
app.use('/createpost', CreatePost);
app.use('/createcomm', CreateCommunity);
app.use('/comment', CreateComment);
app.use('/follow', Follow);
app.use('/community',CreateCommunity);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport Local Authentication
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await Signup.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (isPasswordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    } catch (error) {
      return done(error);
    }
  })
);

const localAuthMiddleware = passport.authenticate('local', { session: false });

// Root Route
app.get('/', (req, res) => {
  res.send('Server is working, successfully ');
});

// Signup API
app.post('/signup', async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password length must be at least 6 characters.' });
  }

  try {
    const existingUser = await Signup.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists.' });
    }

    const person = new Signup({
      name,
      username,
      email,
      password,
    });

    await person.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Login API
const SECRET_KEY = process.env.SECRET_KEY;

app.post('/login', localAuthMiddleware, async (req, res) => {
  const { username } = req.body;

  try {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ message: 'Failed to generate token' });
  }
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start Server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

startServer();
