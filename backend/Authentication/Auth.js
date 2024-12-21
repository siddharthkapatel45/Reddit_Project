import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Token verification error:', err.message);
      return res.status(403).json({ message: 'Invalid or expired token , try again ' });
    }
    req.user = user;
    next();
  });
};


export default authenticateJWT;
