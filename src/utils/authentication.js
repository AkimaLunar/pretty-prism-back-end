import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRY } from '../config';
const bearerRegEx = /^(Bearer )(.*)/;
const verifyJwt = token => jwt.verify(token, JWT_SECRET);

export const hashPassword = password => bcrypt.hash(password, 10);
export const validatePassword = (input, password) =>
  bcrypt.compare(input, password);
export const generateToken = user =>
  // TODO: Refactor to use just the ID
  jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });
export const authenticate = async ({ headers: { authorization } }, Users) => {
  if (authorization && bearerRegEx.test(authorization)) {
    const _token = authorization.replace('Bearer ', '');
    const _decoded = verifyJwt(_token);
    return await Users.findOne({ _id: new ObjectId(_decoded.user.id) });
  }
  return null;
};
