import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `

type Query {
  allPolishes: [Polish!]!
  allUsers: [User!]!
  polish(id: String!): Polish
  comments(polishId: String!): [Comment]!
  messages(receiverId: String!): [Message]!
  chat(receiverId: String!, senderId: String!): [Message]!
}

type Mutation {
  createPolish(
    images: [String],
    name: String!
  ): Polish

  updatePolish(
    id: String!,
    images: [String],
    name: String,
    brand: String,
    status: String
  ): Polish

  deletePolish(
    id: String!
  ): DeletePolishPayload

  createUser(
    username: String!,
    password: String!
  ): User

  updateUser(
    username: String,
    avatar: String
  ) : User

  deleteUser(
    id: ID
  ) : DeleteUserPayload

  login(
    username: String!,
    password: String
  ): LoginPayload

  createComment(
    polishId: String!,
    text: String!
  ): Comment

  deleteComment(
    id: ID
  ) : DeleteUserPayload


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
  status: Status,
  comments: [Comment]!
}

enum Status {
  IDLE
  REQUESTED
  TRANSFER
}

type DeletePolishPayload {
  id: ID
}
type DeleteUserPayload {
  id: ID
}
type DeleteCommentPayload {
  id: ID
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
