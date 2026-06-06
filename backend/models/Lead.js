import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'],
      default: 'New',
    },
    source: {
      type: String,
      required: true,
      enum: ['Website', 'LinkedIn', 'Referral', 'Cold Outreach', 'Partner', 'Other'],
      default: 'Website',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Add index for search optimization
leadSchema.index({ name: 'text', email: 'text', company: 'text' });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
