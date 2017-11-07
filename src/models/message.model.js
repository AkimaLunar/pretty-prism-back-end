import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now() },
  text: { type: String }
});

// TODO: Add transactions to CommentSchema
// - requested {
//     senderId,
//     polishId
//  }
// - swapIniltiated {
//     receiverId,
//     polishLId
//   }

const Message = mongoose.model('Message', MessageSchema);
export default Message;
