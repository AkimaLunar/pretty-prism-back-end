import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
  type Polish {
    id: ID!
    images: [String],
    name: String!,
    brand: String,
    location: String,
    status: String
  }

  type Query {
    allPolishes: [Polish!]!
  }

  type Mutation {
    createPolish(
      images: [String],
      name: String!
    ): Polish
  }

  type User {
    id: ID!,
    username: String!,
    password: String!,
    avatar: String!,
    polishes: [Polish],
    squad: [User],
  }

  type Comment {
    id: ID!,
    polish: Polish!,
    author: User!,
    timestamp: String!,
    text: String!
  }
  
  type Message {
    id: ID!,
    sender: User!,
    receiver: User!,
    timestamp: String!,
    text: String!
  }

`;

export default makeExecutableSchema({ typeDefs, resolvers });
