import express from 'express';

import BasicStrategy from 'passport-http';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model';
import { JWT_SECRET } from '../config';

// COMMENT: STRATEGIES
const basicStrategy = new BasicStrategy((username, password, callback) => {
  let user;
  User.findOne({ username })
    .then(_user => {
      user = _user;
      if (!user) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return callback(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(null, false, err);
      }
      return callback(null, false);
    });
});

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Bearer'),
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

// COMMENT: AUTH ROUTE
const auth = express.Router();
auth.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .exec()
    .then(user => {
      if (!user) {
        return Promise.reject({
          code: 409,
          reason: 'Wrong username',
          message: 'Username already taken',
          location: 'username'
        });
      }
      if (!user.validatePassword(password)) {
        return Promise.reject({
          code: 409,
          reason: 'ValidationError',
          message: 'Wrong password',
          location: 'username'
        });
      }

      return res.status(200).json(user.userChipRepr());
    })
    .catch(() => {
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

export default auth;
