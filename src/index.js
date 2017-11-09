import _env from './env'; // eslint-disable-line
import { PORT } from './config';

import 'babel-polyfill';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';
// TODO: Needs refactoring for GraphQL
// import { basicStrategy, jwtStrategy } from './lib/authStrategies';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './schema';
import connectMongo from './db';

// Express App
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
// passport.use(basicStrategy);
// passport.use(jwtStrategy);

// Server
const start = async () => {
  const mongo = await connectMongo();

  // GraphQL
  app.use(
    '/graphql',
    graphqlExpress({
      context: { mongo },
      schema
    })
  );

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
