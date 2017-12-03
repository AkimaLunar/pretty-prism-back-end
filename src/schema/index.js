import { makeExecutableSchema } from 'graphql-tools';

import resolvers from './resolvers';

const typeDefs = `

type Query {
  polishes(filter:String): [Polish]!
  userById(id: String!): User
  userByUsername(username: String!): User
  polish(id: String!): Polish
  polishesByUser(userId: String!): [Polish]!
  comments(polishId: String!): [Comment]!
  messages(receiverId: String!): [Chat]!
  chat(receiverId: String!, senderId: String!): [Message]!
}

type Mutation {
  createPolish(
    images: [String],
    name: String!
  ): Polish

  uploadImage(upload: Upload!, size: String!): uploadPayload!

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

  startFollow(
    userToFollowId: String!
  ) : FollowPayload!

  stopFollow(
    userToFollowId: String!
  ) : FollowPayload!

  createMessage(
    receiver: String!,
    text: String!
  ): Message
}

scalar Date

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

scalar Upload

type Image {
  id: ID!
  path: String!
  filename: String!
  mimetype: String!
  encoding: String!
}

type uploadPayload {
  url: String!
}

type DeletePolishPayload {
  id: ID
}

type User {
  id: ID!,
  username: String!,
  password: String!,
  avatar: String!,
  polishes: [Polish]!,
  following: [User]
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

type FollowPayload {
  id: ID!
}

type Comment {
  id: ID!,
  polish: Polish!,
  author: User!,
  timestamp: Date!,
  text: String!
}

type DeleteCommentPayload {
  id: ID
}

type Message {
  id: ID!,
  sender: User!,
  receiver: User!,
  timestamp: Date!,
  text: String!
}

type MessagePayload {
  text: String,
  timestamp: Date!
}

type newMessagePayload {
  senderUsername: String!,
  senderId: String!,
  receiverId: String!,
  timestamp: Date!,
  text: String
}

type Chat {
  id: ID!,
  user: User!,
  count: Int!,
  messages: [MessagePayload]
}

type Subscription {
  newMessage(receiverId: String!): newMessagePayload
}


`;

export default makeExecutableSchema({ typeDefs, resolvers });
