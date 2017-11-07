import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default:
      'https://pretty-prism.nyc3.digitaloceanspaces.com/assets/default_avatar.png'
  },
  polishes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Polish'
    }
  ],
  squad: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

// TODO: Add messages static

UserSchema.methods.userChipRepr = function() {
  return {
    username: this.username,
    avatar: this.avatar
    // TODO: ADD online
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);
export default User;
