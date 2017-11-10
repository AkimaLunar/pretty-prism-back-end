import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRY } from '../config';
import { assertValidUser } from './assertions';

const hashPassword = password => bcrypt.hash(password, 10);
const validatePassword = (input, password) => bcrypt.compare(input, password);
const generateToken = user =>
  jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });

export default {
  Query: {
    allPolishes: async (root, data, { mongo: { Polishes } }) =>
      await Polishes.find({}).toArray(),

    allUsers: async (root, data, { mongo: { Users } }) =>
      await Users.find({}).toArray()
  },

  Mutation: {
    createPolish: async (root, data, { mongo: { Polishes }, user }) => {
      assertValidUser(user);
      const newPolish = Object.assign({ ownersIds: [user && user._id] }, data);
      const response = await Polishes.insert(newPolish);
      return Object.assign({ id: response.insertedIds[0] }, newPolish);
    },

    createUser: async (root, data, { mongo: { Users } }) => {
      const _hash = await hashPassword(data.password);
      const newUser = Object.assign({}, data, {
        password: _hash,
        avatar:
          'https://pretty-prism.nyc3.digitaloceanspaces.com/assets/default_avatar.png'
      });
      const response = await Users.insert(newUser);
      return Object.assign({ id: response.insertedIds[0] }, newUser);
    },

    login: async (root, data, { mongo: { Users } }) => {
      const user = await Users.findOne({ username: data.username });
      const _validPassword = await validatePassword(
        data.password,
        user.password
      );
      if (_validPassword) {
        return {
          token: generateToken(user)
        };
      }
    }
  },

  Polish: {
    id: root => root._id || root.id,
    owners: async ({ ownersIds }, data, { mongo: { Users } }) =>
      await ownersIds.map(id => Users.findOne({ _id: new ObjectId(id) }))
  },
  User: {
    id: root => root._id || root.id
  }
};
