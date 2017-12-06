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
  messages(chatId: String!): [Chat]!
  chatById(id: String!): Chat!
  chatByUser(receiverId: String!): Chat!
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

  createChat(
    receiverId: String!
  ): Chat!

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
  chat: Chat!,
  sender: User!,
  timestamp: Date!,
  text: String!
}

type Chat {
  id: ID!,
  messages: [Message]!,
  users: [User]!
}

type MessagePayload {
  text: String,
  timestamp: Date!
}

type Subscription {
  newMessage(receiverId: String!): MessagePayload
}


`;

export default makeExecutableSchema({ typeDefs, resolvers });
