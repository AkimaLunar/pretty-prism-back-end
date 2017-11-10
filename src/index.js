import _env from './env'; // eslint-disable-line
import { PORT } from './config';

import 'babel-polyfill';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './schema';
import connectMongo from './db';

import passport from 'passport';
import { authenticate } from './authentication';

// Express App
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

// Server
const start = async () => {
  const mongo = await connectMongo();
  const buildOptions = async req => {
    const user = await authenticate(req, mongo.Users);
    return {
      context: { mongo, user },
      schema
    };
  };

  // GraphQL
  app.use('/graphql', graphqlExpress(buildOptions));

  // Graphiql
  app.use(
    '/test',
    graphiqlExpress({
      endpointURL: '/graphql'
    })
  );
  app.listen(PORT, () => {
    console.log(`All systems ready on port ${PORT}`);
  });
};

start();
