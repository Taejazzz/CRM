import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ['Created', 'Status Change', 'Updated', 'Deleted'],
    },
    leadName: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
