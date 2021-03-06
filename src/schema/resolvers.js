import { ObjectId } from 'mongodb';
import { GraphQLUpload } from 'apollo-upload-server';
import { withFilter } from 'graphql-subscriptions';
import { pubsub } from '../subscriptions';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

import {
  assertValidUser,
  assertValidPolishId,
  assertValidOwner,
  assertValidAuthor
} from './assertions';
import {
  hashPassword,
  validatePassword,
  generateToken
} from '../utils/authentication';
import { processUpload, DOUpload } from '../utils/uploads';
import { buildFilters } from '../utils/filters';
import { findOrCreate } from '../utils/helpers';
import { logger, loggerJson } from '../utils/logger';
export default {
  // COMMENT: QUERIES

  Query: {
    userById: async (root, data, { mongo: { Users } }) =>
      await Users.findOne({ _id: new ObjectId(data.id) }),

    userByUsername: async (root, data, { mongo: { Users } }) =>
      await Users.findOne({ username: data.username }),

    polishes: async (root, { filter }, { mongo: { Polishes }, user }) =>
      await Polishes.find(buildFilters(filter, user)).toArray(),

    polish: async (root, data, { mongo: { Polishes } }) =>
      await Polishes.findOne({ _id: new ObjectId(data.id) }),

    polishesByUser: async (root, data, { mongo: { Polishes } }) =>
      await Polishes.find({
        'ownersIds.0': new ObjectId(data.userId)
      }).toArray(),

    comments: async (root, data, { mongo: { Comments } }) =>
      await Comments.find({ polishId: data.polishId }).toArray(),

    chatById: async (root, { id }, { mongo: { Chats } }) =>
      await Chats.findOne({ _id: new ObjectId(id) }),

    chatByUser: async (root, { receiverId }, { mongo: { Chats }, user }) => {
      if (!user) {
        return null;
      }
      const chat = await Chats.findOne({
        users: {
          $all: [new ObjectId(receiverId), user._id]
        }
      });
      if (chat) {
        return chat;
      }
      const newChat = {
        users: [new ObjectId(receiverId), user._id]
      };
      const response = await Chats.insert(newChat);
      return Object.assign({ id: response.insertedIds[0] }, newChat);
    }
  },

  // COMMENT: MUTATIONS

  Mutation: {
    createPolish: async (root, data, { mongo: { Polishes }, user }) => {
      assertValidUser(user);
      const newPolish = Object.assign(
        {
          ownersIds: [user && user._id],
          status: 'IDLE'
        },
        data
      );
      const response = await Polishes.insert(newPolish);
      return Object.assign({ id: response.insertedIds[0] }, newPolish);
    },

    updatePolish: async (root, data, { mongo: { Polishes }, user }) => {
      const { id, ...payload } = data;
      await assertValidOwner(user, id, Polishes);
      const response = await Polishes.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...payload } }
      );
      return Object.assign({}, response.value, payload);
    },

    deletePolish: async (root, data, { mongo: { Polishes }, user }) => {
      const { id } = data;
      await assertValidOwner(user, id, Polishes);
      await Polishes.deleteOne({ _id: new ObjectId(id) });
      return { id };
    },

    uploadImage: async (root, { upload, size }, { user }) => {
      assertValidUser(user);
      const image = await processUpload(upload, size, user.username);
      const url = await DOUpload(image);
      return {
        url
      };
    },

    createUser: async (root, data, { mongo: { Users } }) => {
      const _hash = await hashPassword(data.password);
      const newUser = Object.assign({}, data, {
        password: _hash,
        avatar:
          'https://pretty-prism.nyc3.digitaloceanspaces.com/assets/default_avatar.png',
        following: []
      });
      const response = await Users.insert(newUser);
      const insertedUser = {
        id: response.insertedIds[0],
        username: newUser.username,
        avatar: newUser.avatar
      };
      return {
        token: generateToken(insertedUser),
        ...insertedUser
      };
    },

    updateUser: async (root, data, { mongo: { Users }, user }) => {
      assertValidUser(user);
      const { _id } = user;
      const response = await Users.findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: { ...data } }
      );
      return Object.assign({}, response.value, data);
    },

    deleteUser: async (root, data, { mongo: { Users }, user }) => {
      await assertValidUser(user);
      const { _id } = user;
      await Users.deleteOne({ _id: new ObjectId(_id) });
      return { _id };
    },

    // TODO: Update password

    login: async (root, data, { mongo: { Users } }) => {
      const _user = await Users.findOne({ username: data.username });
      const _validPassword = await validatePassword(
        data.password,
        _user.password
      );
      if (_validPassword) {
        const user = {
          id: _user._id,
          username: _user.username,
          avatar: _user.avatar
        };
        return {
          token: generateToken(user),
          ...user
        };
      }
    },
    startFollow: async (
      root,
      { userToFollowId },
      { mongo: { Users }, user }
    ) => {
      assertValidUser(user);
      const { _id } = user;
      await Users.update(
        { _id: new ObjectId(_id) },
        { $push: { following: userToFollowId } }
      );
      return { id: userToFollowId };
    },
    stopFollow: async (
      root,
      { userToFollowId },
      { mongo: { Users }, user }
    ) => {
      assertValidUser(user);
      const { _id } = user;
      await Users.update(
        { _id: new ObjectId(_id) },
        { $pull: { following: userToFollowId } }
      );
      return { id: userToFollowId };
    },
    createComment: async (
      root,
      data,
      { mongo: { Comments, Polishes }, user }
    ) => {
      assertValidPolishId(new ObjectId(data.polish), Polishes);
      assertValidUser(user);
      const newComment = Object.assign({}, data, {
        timestamp: Date.now(),
        author: user._id
      });
      const response = await Comments.insert(newComment);
      return Object.assign({ id: response.insertedIds[0] }, newComment);
    },

    deleteComment: async (root, data, { mongo: { Comments }, user }) => {
      const { id } = data;
      await assertValidAuthor(user, id, Comments);
      await Comments.deleteOne({ _id: new ObjectId(id) });
      return Object.assign({ id });
    },

    createChat: async (root, { receiverId }, { mongo: { Chats }, user }) => {
      assertValidUser(user);
      const newChat = {
        users: [new ObjectId(receiverId), user._id]
      };
      const response = await Chats.insert(newChat);
      return Object.assign({ id: response.insertedIds[0], newChat });
    },

    createMessage: async (root, data, { mongo: { Messages }, user }) => {
      assertValidUser(user);
      const _data = Object.assign(data, {
        timestamp: Date.now(),
        sender: user._id
      });
      const response = await Messages.insert(_data);
      const newMessage = Object.assign({ id: response.insertedIds[0] }, _data);
      loggerJson('newMessage', newMessage);
      pubsub.publish('chat', { chat: newMessage });
      return newMessage;
    }
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    }
  }),

  Polish: {
    id: root => root._id || root.id,
    owners: async ({ ownersIds }, data, { mongo: { Users } }) =>
      await ownersIds.map(id => Users.findOne({ _id: new ObjectId(id) })),
    comments: async ({ _id }, data, { mongo: { Comments } }) =>
      await Comments.find({ polishId: _id.toString() }).toArray()
  },
  User: {
    id: root => root._id || root.id,
    password: () => '',
    polishes: async (root, data, { mongo: { Polishes } }) =>
      await Polishes.find({
        'ownersIds.0': root._id
      }).toArray(),
    following: async ({ following }, data, { mongo: { Users } }) =>
      await following.map(id => Users.findOne({ _id: new ObjectId(id) })),
    chats: async ({ _id }, data, { mongo: { Chats } }) =>
      await Chats.find({ users: { $in: [_id] } }).toArray()
  },
  Comment: {
    id: root => root._id || root.id,
    author: async ({ author }, data, { mongo: { Users } }) =>
      await Users.findOne({ _id: author })
  },

  Chat: {
    id: root => root._id || root.id,
    users: async ({ users }, data, { mongo: { Users } }) =>
      await users.map(id => Users.findOne({ _id: ObjectId(id) })),
    messages: async ({ _id }, data, { mongo: { Messages } }) =>
      await Messages.find({
        chatId: _id.toString()
      }).toArray()
  },

  Message: {
    id: root => root._id || root.id,
    sender: async ({ sender }, data, { mongo: { Users } }) =>
      await Users.findOne({ _id: sender }),
    chat: async ({ chatId }, data, { mongo: { Chats } }) =>
      await Chats.findOne({ _id: new ObjectId(chatId) })
  },

  Upload: GraphQLUpload,

  Subscription: {
    chat: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('chat'),
        (root, data) => {
          loggerJson('ROOT', root);
          loggerJson('DATA', data);
          return root.chat.chatId === data.chatId;
        }
      )
    },
    newMessage: {
      subscribe: () => pubsub.asyncIterator('newMessage')
    }
  }
};
