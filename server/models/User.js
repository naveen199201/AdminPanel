import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    mobile: String,
    password: String,
    role: { type: String, enum: ['admin', 'agent'], default: 'agent' },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Virtual field to count DistributedItems linked to this user as agent
userSchema.virtual('count', {
  ref: 'DistributedItem',  // Model to reference
  localField: '_id',       // User _id
  foreignField: 'agentId', // DistributedItem.agentId
  count: true,             // Return count instead of documents
});

const User = mongoose.model('User', userSchema);

export default User;
