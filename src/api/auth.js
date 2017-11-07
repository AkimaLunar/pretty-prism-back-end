import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

import { JWT_SECRET, JWT_EXPIRY } from '../config';

const createAuthToken = user =>
  jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });

// COMMENT: AUTH ROUTE
const auth = express.Router();
auth.post(
  '/login',
  passport.authenticate('basic', { session: false }),
  (req, res) => {
    const authToken = createAuthToken(req.user.apiRepr());
    res.json({ authToken });
  }
);

export default auth;
