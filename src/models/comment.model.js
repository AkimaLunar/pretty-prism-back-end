import mongoose from 'mongoose';

const CommentSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  polishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Polish' },
  timestamp: { type: Date, default: Date.now() },
  text: { type: String }
});

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
