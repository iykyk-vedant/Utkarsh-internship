const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Technical', 'Billing', 'Service', 'Product', 'Other'],
      message: 'Category must be one of: Technical, Billing, Service, Product, Other'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'In Progress', 'Resolved'],
      message: 'Status must be one of: Pending, In Progress, Resolved',
      default: 'Pending'
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
complaintSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);