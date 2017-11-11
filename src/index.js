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
    logger(`Logged in user: ${user.username}`);
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
      endpointURL: '/graphql',
      passHeader:
        '"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVhMDVkMWIyNDg0MzAxMGZlMmVlMTM4YiIsInVzZXJuYW1lIjoidGlnZXIiLCJwYXNzd29yZCI6IiQyYSQxMCRRWVFrZXgudVVsTFBIVnFKSUVYMjJPSW4wOVFuLnk1VEJ5bXJvaHo2ZTV3WlVvU3FyYlp6VyIsImF2YXRhciI6Imh0dHBzOi8vcHJldHR5LXByaXNtLm55YzMuZGlnaXRhbG9jZWFuc3BhY2VzLmNvbS9hc3NldHMvZGVmYXVsdF9hdmF0YXIucG5nIn0sImlhdCI6MTUxMDMzMDg1OSwiZXhwIjoxNTEwOTM1NjU5LCJzdWIiOiJ0aWdlciJ9.RaUpwf5-4bgy5TnW73eQqfZ09stJre4X-EoQlCPmyvA"'
    })
  );
  app.listen(PORT, () => {
    logger(`All systems ready on port ${PORT}`);
  });
};

start();
