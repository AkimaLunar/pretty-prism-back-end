// Environment
import _env from './env'; // eslint-disable-line
import { PORT, PATH } from './config';
import 'babel-polyfill';

// Express
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';

// GraphQL & DB
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { apolloUploadExpress } from 'apollo-upload-server';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import schema from './schema';
import connectMongo from './db';
import { authenticate } from './utils/authentication';

import { logger } from './utils/logger';

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

  // GraphQL
  app.use('/graphql', apolloUploadExpress(), graphqlExpress(buildOptions));

  // Graphiql
  app.use(
    '/playground',
    graphiqlExpress({
      endpointURL: '/graphql',
      // passHeader:
      //   '"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWExYTMzNGE5MmU3YWQyMTc4MGQ1NGQ4IiwidXNlcm5hbWUiOiJ0aWdlcmtpdHR5IiwiYXZhdGFyIjoiaHR0cHM6Ly9wcmV0dHktcHJpc20ubnljMy5kaWdpdGFsb2NlYW5zcGFjZXMuY29tL2Fzc2V0cy9kZWZhdWx0X2F2YXRhci5wbmcifSwiaWF0IjoxNTEyMDYyMTQ5LCJleHAiOjE1MTI2NjY5NDksInN1YiI6InRpZ2Vya2l0dHkifQ.eqwB4VvXt1nipbefYrbRZHA7hgfPUr3TheUrAfBtaJY"',
      subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
    })
  );
  const server = createServer(app);
  server.listen(PORT, () => {
    SubscriptionServer.create(
      { execute, subscribe, schema },
      { server, path: '/subscriptions' }
    );
    logger(`All systems ready on port ${PORT}`);
  });
};

start();
