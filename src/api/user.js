import express from 'express';
import mongoose from 'mongoose';
import Polish from '../models/polish.model';
import User from '../models/user.model';

const userApi = express.Router();

// TODO: Remove from prod
// COMMENT: GET ALL
userApi.get('/', (req, res) => {
  User.find()
    .limit(50)
    .exec()
    .then(users => {
      if (!users) {
        return res.status(404).json({ message: 'No users found.' });
      }
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Filter

// Search

// COMMENT: CREATE A USER
userApi.post('/', (req, res) => {
  const { username, password, email } = req.body;

  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(409).json({
      code: 409,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'email'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );
  if (nonStringField) {
    return res.status(409).json({
      code: 409,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(409).json({
      code: 409,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 10,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(409).json({
      code: 409,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  User.find({ username })
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 409,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
    .then(hash =>
      User.create({
        email,
        username,
        password: hash
      })
    )
    .then(user => res.status(201).json(user.userChipRepr()))
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

// COMMENT: GET BY ID
userApi.get('/:id', (req, res) => {
  const { id } = req.params;
  User.findById({ _id: id })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(201).json(user.userChipRepr());
    })
    .catch(() => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

// TODO: Remove from prod
// COMMENT: DELETE BY ID
userApi.delete('/:id', (req, res) => {
  const { id } = req.params;
  User.findByIdAndRemove({ _id: id })
    .exec()
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(500).json({ message: 'Internal server error' });
    });
});
export default userApi;
