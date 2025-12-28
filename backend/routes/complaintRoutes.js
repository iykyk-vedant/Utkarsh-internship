const express = require('express');
const { protect, admin } = require('../middleware/auth');
const {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint
} = require('../controllers/complaintController');

const router = express.Router();

// All routes are protected
router.route('/')
  .get(protect, getComplaints)
  .post(protect, createComplaint);

router.route('/:id')
  .get(protect, getComplaint)
  .put(protect, updateComplaint)
  .delete(protect, deleteComplaint);

// Admin only route to update complaint status
router.route('/:id/status').put(protect, admin, updateComplaintStatus);

module.exports = router;