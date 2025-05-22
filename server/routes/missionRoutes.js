// server/routes/missionRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createMission, 
  getMissions, 
  getMissionById, 
  updateMission, 
  deleteMission 
} = require('../controllers/missionController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All mission routes require authentication
router.use(protect);

// Get all missions and create a mission
router.route('/')
  .get(getMissions)
  .post(createMission);

// Get, update and delete a specific mission
router.route('/:id')
  .get(getMissionById)
  .put(updateMission)
  .delete(deleteMission);

module.exports = router;