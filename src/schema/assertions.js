import { ObjectId } from 'mongodb';
import { logger } from '../lib/logger';

// class ValidationError extends Error {
//   constructor(message, field) {
//     super(message);
//     this.field = field;
//   }
// }

export const assertValidUser = user => {
  try {
    if (!user && !user._id) throw new Error();
  } catch (error) {
    throw new Error('Access denied');
  }
};

export const assertValidOwner = async (user, id, Polishes) => {
  try {
    if (!user && !user._id) throw new Error('No user');
    const _polish = await Polishes.findOne({ _id: new ObjectId(id) });
    if (!_polish) throw new Error('Polish not found');
    const _originalOwner = _polish.ownersIds[_polish.ownersIds.length - 1];
    if (user._id.toString !== _originalOwner.toString)
      throw new Error(
        'User doesnt have access to the operation: IDs dont match.'
      );
  } catch (error) {
    logger(error);
    throw new Error('Access denied');
  }
};

export const assertValidAuthor = async (user, id, Comments) => {
  try {
    if (!user && !user._id) throw new Error('No user');
    const _comment = await Comments.findOne({ _id: new ObjectId(id) });
    if (!_comment) throw new Error('Polish not found');
    const _author = _comment.author;
    if (user._id.toString !== _author.toString)
      throw new Error(
        'User doesnt have access to the operation: IDs dont match.'
      );
  } catch (error) {
    logger(error);
    throw new Error('Access denied');
  }
};

// export const assertValidPolishInput = data => {
//   try {
//     if (!data) throw new Error('Access denied');
//   } catch (error) {
//     throw new ValidationError('Link validation error: invalid url.', 'url');
//   }
// };

export const assertValidPolishId = async (id, Polishes) => {
  try {
    const _polish = await Polishes.find({ _id: id }, { _id: 1 }).limit(1);
    if (!_polish) throw new Error();
  } catch (error) {
    throw new Error('Wrong polish ID');
  }
};
