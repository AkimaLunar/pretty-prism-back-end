import express from 'express';
import mongoose from 'mongoose';
import Polish from '../models/polish.model';
import User from '../models/user.model';

const polishApi = express.Router();

// COMMENT: GET ALL
polishApi.get('/', (req, res) => {
  Polish.find()
    .limit(50)
    .exec()
    .then(polishes => {
      if (!polishes) {
        return res.status(404).json({ message: 'No polishes found.' });
      }
      res.status(200).json(polishes);
    })
    .catch(() => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

// COMMENT: GET BY ID
polishApi.get('/:id', (req, res) => {
  const id = req.params.id;
  Polish.findById(id)
    .exec()
    .then(polish => {
      if (!polish) {
        return res
          .status(404)
          .json({ message: `Polish with ID ${id} not found` });
      }
      res.status(200).json(polish);
    })
    .catch(() => {
      res.status(500).json({ message: 'Internal server error' });
    });
});

// COMMENT: CREATE
polishApi.post('/', (req, res) => {
  const requiredFields = [''];
});

// COMMENT: Filter

// COMMENT:
export default polishApi;
