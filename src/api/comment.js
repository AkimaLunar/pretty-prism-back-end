import express from 'express';
import mongoose from 'mongoose';
import Polish from '../models/polish.model';
import User from '../models/user.model';
import Comment from '../models/comment.model';

const commentApi = express.Router();

// Get all
commentApi.get('/', (req, res) => {
  Comment.find()
    .limit(50)
    .exec()
    .then(comments => {
      if (!comments) {
        return res.status(404).json({ message: 'No comments found.' });
      }
      res.status(200).json(comments);
    })
    .catch(err => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Filter

// Search

export default commentApi;
