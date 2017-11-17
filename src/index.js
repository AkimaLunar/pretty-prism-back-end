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
import { authenticate } from './authentication';

import { logger } from './lib/logger';

// Express App
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

// Server
const start = async () => {
  const mongo = await connectMongo();
  const buildOptions = async req => {
    const user = await authenticate(req, mongo.Users);
    user
      ? logger(`Logged in user: ${user.username}`)
      : logger('Anonynous session');

    return {
      context: { mongo, user },
      schema
    };
  };

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'PrettyPrism API' });
  });
  // GraphQL
  app.use('/graphql', graphqlExpress(buildOptions));

  // Graphiql
  app.use(
    '/playground',
    graphiqlExpress({
      endpointURL: '/graphql'
    })
  );
  app.listen(PORT, () => {
    logger(`All systems ready on port ${PORT}`);
  });
};

start();
