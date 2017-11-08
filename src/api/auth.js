import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import { JWT_SECRET, JWT_EXPIRY } from '../config';

const createAuthToken = user =>
  jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });

// COMMENT: LOGIN
const auth = express.Router();
auth.post(
  '/login',
  passport.authenticate('basic', { session: false }),
  (req, res) => {
    const authToken = createAuthToken(req.user.userChipRepr());
    res.json({ authToken });
  }
);

// COMMENT: TEST ENDPOINT
auth.get(
  '/test',
  passport.authenticate('jwt', { session: false }),
  (req, res) =>
    res.json({
      data: 'You have a secret access code'
    })
);

export default auth;
