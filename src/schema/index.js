import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `

type Query {
  allPolishes: [Polish!]!
  userById(id: String!): User
  userByUsername(username: String!): User
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

  signS3(filename: String!, filetype: String!): S3Payload!

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
  ): LoginPayload

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

type S3Payload {
  signedRequest: String!,
  url: String!,
}

type DeletePolishPayload {
  id: ID
}

type User {
  id: ID!,
  username: String!,
  password: String!,
  avatar: String!
}

type DeleteUserPayload {
  id: ID
}

type LoginPayload {
  token: String!,
  id: String!,
  username: String!,
  avatar: String!
}

type Comment {
  id: ID!,
  polish: Polish!,
  author: User!,
  timestamp: String!,
  text: String!
}

type DeleteCommentPayload {
  id: ID
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
