const Complaint = require('../models/Complaint');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = asyncHandler(async (req, res) => {
  try {
    let complaints;
    
    // If user is admin, return all complaints
    if (req.user.role === 'admin') {
      complaints = await Complaint.find()
        .populate('owner', 'email')
        .sort({ createdAt: -1 });
    } else {
      // If user is regular user, return only their complaints
      complaints = await Complaint.find({ owner: req.user.id })
        .populate('owner', 'email')
        .sort({ createdAt: -1 });
    }
    
    res.json(complaints);
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaint = asyncHandler(async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('owner', 'email');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Check if user owns the complaint or is admin
    if (complaint.owner._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to access this complaint' });
    }
    
    res.json(complaint);
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  
  try {
    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Please provide title, description, and category' });
    }
    
    const complaint = new Complaint({
      title,
      description,
      category,
      owner: req.user.id
    });
    
    const createdComplaint = await complaint.save();
    const populatedComplaint = await Complaint.findById(createdComplaint._id).populate('owner', 'email');
    
    res.status(201).json(populatedComplaint);
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = asyncHandler(async (req, res) => {
  const { title, description, category, status } = req.body;
  
  try {
    let complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Check if user owns the complaint or is admin
    if (complaint.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this complaint' });
    }
    
    // For regular users, only allow updating title, description, and category
    // For admins, allow updating status as well
    if (req.user.role === 'admin') {
      complaint.title = title || complaint.title;
      complaint.description = description || complaint.description;
      complaint.category = category || complaint.category;
      complaint.status = status || complaint.status;
    } else {
      // Regular users can only update their own complaints (title, description, category)
      complaint.title = title || complaint.title;
      complaint.description = description || complaint.description;
      complaint.category = category || complaint.category;
    }
    
    const updatedComplaint = await complaint.save();
    const populatedComplaint = await Complaint.findById(updatedComplaint._id).populate('owner', 'email');
    
    res.json(populatedComplaint);
  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update complaint status (admin only)
// @route   PUT /api/complaints/:id/status
// @access  Private/Admin
const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  // Validate status
  const validStatuses = ['Pending', 'In Progress', 'Resolved'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be Pending, In Progress, or Resolved' });
  }
  
  try {
    let complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Only admins can update status
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update complaint status' });
    }
    
    complaint.status = status;
    const updatedComplaint = await complaint.save();
    const populatedComplaint = await Complaint.findById(updatedComplaint._id).populate('owner', 'email');
    
    res.json(populatedComplaint);
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private
const deleteComplaint = asyncHandler(async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Only the owner or admin can delete a complaint
    if (complaint.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this complaint' });
    }
    
    await Complaint.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Complaint removed' });
  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint
};