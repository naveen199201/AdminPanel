import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobile: String,
  password: String,
  role: { type: String, enum: ['admin', 'agent'], default: 'agent' },
});

const User = mongoose.model('User', userSchema);

export default User;
