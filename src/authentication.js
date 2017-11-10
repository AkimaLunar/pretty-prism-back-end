import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRY } from './config';

const bearerRegEx = /^(Bearer )(.*)/;
const verifyJwt = token => {
  console.log(`Token: ${token}`);
  return jwt.verify(token, JWT_SECRET);
};
export const authenticate = async ({ headers: { authorization } }, Users) => {
  if (authorization && bearerRegEx.test(authorization)) {
    const _token = authorization.replace('Bearer ', '');
    const _decoded = verifyJwt(_token);
    console.log(JSON.stringify(_decoded, '', 2));
    return await Users.findOne({ _id: new ObjectId(_decoded.user._id) });
  }
  return null;
};
