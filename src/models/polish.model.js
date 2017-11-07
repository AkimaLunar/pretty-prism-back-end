import mongoose from 'mongoose';

const PolishSchema = mongoose.Schema({
  images: [String],
  name: String,
  brand: String,
  location: String,
  owners: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

const Polish = mongoose.model('Polish', PolishSchema);
export default Polish;
