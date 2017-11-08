import { BasicStrategy } from 'passport-http';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { JWT_SECRET } from '../config';

import User from '../models/user.model';

// COMMENT: STRATEGIES
export const basicStrategy = new BasicStrategy(
  (username, password, callback) => {
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
  }
);

export const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user);
  }
);
