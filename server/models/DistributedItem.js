import mongoose from 'mongoose';

const DistributedItemSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    FirstName: {
      type: String,
      required: true,
      trim: true,
    },
    Phone: {
      type: String,
      required: true,
      trim: true,
    },
    Notes: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('DistributedItem', DistributedItemSchema);

