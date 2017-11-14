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
    '/test',
    // User
    graphiqlExpress({
      endpointURL: '/graphql',
      passHeader:
        '"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVhMDVkMWIyNDg0MzAxMGZlMmVlMTM4YiIsInVzZXJuYW1lIjoidGlnZXJraXR0eSIsInBhc3N3b3JkIjoiJDJhJDEwJFFZUWtleC51VWxMUEhWcUpJRVgyMk9JbjA5UW4ueTVUQnltcm9oejZlNXdaVW9TcXJiWnpXIiwiYXZhdGFyIjoiaHR0cHM6Ly9wcmV0dHktcHJpc20ubnljMy5kaWdpdGFsb2NlYW5zcGFjZXMuY29tL2Fzc2V0cy9kZWZhdWx0X2F2YXRhci5wbmcifSwiaWF0IjoxNTEwNDY0NTcxLCJleHAiOjE1MTEwNjkzNzEsInN1YiI6InRpZ2Vya2l0dHkifQ.6XhUXRF1uVm8pTz9OuaCFf2dIMUxWlVhsLNH_Y-d8IM"'
    })
    // Anonymous
    // graphiqlExpress({
    //   endpointURL: '/graphql'
    // })
  );
  app.listen(PORT, () => {
    logger(`All systems ready on port ${PORT}`);
  });
};

start();
