import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `

type Query {
  allPolishes: [Polish!]!
  allUsers: [User!]!
  polish(id: String!): Polish
  messages(receiverId: String!): [Message]!
  chat(receiverId: String!, senderId: String!): [Message]!
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

  createComment(
    polishId: String!,
    text: String!
  ): Comment

  createMessage(
    receiver: String!,
    text: String!
  ): Message
}
  type Polish {
    id: ID!,
    images: [String]!,
    name: String!,
    owners: [User!]!
    brand: String,
    location: String,
    status: String,
    comments: [Comment]!
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
