import _env from './env'; // eslint-disable-line

import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import socket from 'socket.io';
import cors from 'cors';
import passport from 'passport';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import polishApi from './api/polish';
import userApi from './api/user';
import messageApi from './api/message';
import commentApi from './api/comment';
import auth from './api/auth';
import { basicStrategy, jwtStrategy } from './lib/authStrategies';
import { DATABASE_URL, PORT } from './config';

const app = express();
const io = socket(http);
// app.server = http.createServer(app);
app.use(morgan('dev'));

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

app.use('/polish', polishApi);
app.use('/user', userApi);
app.use('/auth', auth);
app.use('/message', messageApi);
app.use('/comment', commentApi);
app.get('/', (req, res) => {
  res.json({ hello: 'hello' });
});

// Server
let server;
const runServer = function(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
};

const closeServer = function() {
  return mongoose.disconnect().then(
    () =>
      new Promise((resolve, reject) => {
        server.close(err => {
          if (!err) {
            resolve();
          } else {
            reject(err);
          }
        });
      })
  );
};

if (require.main === module) {
  runServer().catch(err => console.log(err));
}

export { app, runServer, closeServer };
