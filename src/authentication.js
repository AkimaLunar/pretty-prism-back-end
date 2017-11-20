import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';

const bearerRegEx = /^(Bearer )(.*)/;
const verifyJwt = token => jwt.verify(token, JWT_SECRET);

// eslint-disable-next-line import/prefer-default-export
export const authenticate = async ({ headers: { authorization } }, Users) => {
  if (authorization && bearerRegEx.test(authorization)) {
    const _token = authorization.replace('Bearer ', '');
    const _decoded = verifyJwt(_token);
    return await Users.findOne({ _id: new ObjectId(_decoded.user.id) });
  }
  return null;
};
