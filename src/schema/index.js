import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `

type Query {
  allPolishes: [Polish!]!
  allUsers: [User!]!
}

type Mutation {
  createPolish(
    images: [String],
    name: String!
  ): Polish

  createUser(
    username: String!,
    password: String!
  ): User

  login(
    username: String!,
    password: String
  ): LoginPayload
}
  type Polish {
    id: ID!
    images: [String],
    name: String!,
    owners: [User]!
    brand: String,
    location: String,
    status: String
  }

  type User {
    id: ID!,
    username: String!,
    password: String!,
    avatar: String!
  }

  type LoginPayload {
    token: String!
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
