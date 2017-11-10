import { ObjectID } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRY } from '../config';

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
    createPolish: async (root, data, { mongo: { Polishes } }) => {
      const response = await Polishes.insert(data);
      return Object.assign({ id: response.insertedIds[0] }, data);
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
      console.log(`User: ${JSON.stringify(user, '', 2)}`);
      const _validPassword = await validatePassword(
        data.password,
        user.password
      );
      console.log(`Valid password: ${_validPassword}`);
      if (_validPassword) {
        const _token = await generateToken(user);
        console.log(`Token: ${_token}`);
        return {
          token: _token
        };
      }
    }
  },

  Polish: {
    id: root => root._id || root.id
  },
  User: {
    id: root => root._id || root.id
  }
};
