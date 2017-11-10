import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRY } from './config';

const bearerRegEx = /^(Bearer )(.*)/;
const verifyJwt = token =>
  jwt.verify(token, JWT_SECRET, {
    algorithms: ['HSA'],
    expiresIn: JWT_EXPIRY
  });

const authenticate = async ({ headers: { authorization } }, Users) => {
  if (authorization && bearerRegEx.test(authorization)) {
    const _token = authorization.replace('Bearer: ', '');
    const _decoded = verifyJwt(_token);
    return await Users.findOne({ _id: _decoded.user._id });
  }
  return {};
};

export default { authenticate };
