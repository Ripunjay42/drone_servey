// server/routes/droneRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createDrone, 
  getDrones, 
  getAvailableDrones,
  getDroneById, 
  updateDrone, 
  deleteDrone 
} = require('../controllers/droneController');
const { protect } = require('../middleware/authMiddleware');

// All drone routes require authentication
router.use(protect);

// Get all drones and create a drone
router.route('/')
  .get(getDrones)
  .post(createDrone);

// Get available drones for mission planning
router.route('/available')
  .get(getAvailableDrones);

// Get, update and delete a specific drone
router.route('/:id')
  .get(getDroneById)
  .put(updateDrone)
  .delete(deleteDrone);

module.exports = router;