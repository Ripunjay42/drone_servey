// server/controllers/missionController.js
const Mission = require('../models/missionModel');
const User = require('../models/userModel');
const Drone = require('../models/droneModel');

// @desc    Create a new mission
// @route   POST /api/missions
// @access  Private
const createMission = async (req, res) => {
  try {
    const {
      name,
      description,
      surveyArea,
      flightParameters,
      schedule,
      drone
    } = req.body;

    if (!drone) {
      return res.status(400).json({ message: 'A drone must be assigned to the mission' });
    }

    // Verify drone exists and is available
    const droneExists = await Drone.findById(drone);
    if (!droneExists) {
      return res.status(404).json({ message: 'Selected drone not found' });
    }

    if (droneExists.status !== 'available') {
      return res.status(400).json({ message: 'Selected drone is not available' });
    }

    // Check if drone is already assigned to another mission at this time
    const missionDateTime = new Date(schedule.dateTime);
    const overlappingMissions = await Mission.find({
      drone: drone,
      'schedule.dateTime': { $eq: missionDateTime },
      status: { $in: ['scheduled', 'in-progress'] }
    });

    if (overlappingMissions.length > 0) {
      return res.status(400).json({ 
        message: 'The selected drone is already assigned to another mission at this time' 
      });
    }

    // Add the current user to the mission
    const mission = await Mission.create({
      name,
      description,
      user: req.user.id,
      drone,
      surveyArea,
      flightParameters,
      schedule,
      status: 'scheduled' // Set status to scheduled when created
    });

    res.status(201).json(mission);
  } catch (error) {
    console.error('Error creating mission:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all missions for current user
// @route   GET /api/missions
// @access  Private
const getMissions = async (req, res) => {
  try {
    // Find missions belonging to the current user
    // Admins can see all missions, others see only their own
    const filter = req.user.role === 'admin' ? {} : { user: req.user.id };
    
    const missions = await Mission.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('drone', 'name model serialNumber');

    res.status(200).json(missions);
  } catch (error) {
    console.error('Error fetching missions:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single mission by ID
// @route   GET /api/missions/:id
// @access  Private
const getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id)
      .populate('user', 'name email')
      .populate('drone', 'name model serialNumber');

    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    // Check if user has permission to view this mission
    if (mission.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this mission' });
    }

    res.status(200).json(mission);
  } catch (error) {
    console.error('Error fetching mission:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a mission
// @route   PUT /api/missions/:id
// @access  Private
const updateMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    // Check if user has permission to update this mission
    if (mission.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this mission' });
    }

    // Cannot update missions that are already completed, but allow status changes
    if (mission.status === 'completed' && !req.body.status) {
      return res.status(400).json({ message: `Cannot update mission with status: ${mission.status}` });
    }
    
    // Allow status changes from in-progress to completed or aborted
    if (mission.status === 'in-progress' && !['completed', 'aborted'].includes(req.body.status)) {
      // Only allow status updates for in-progress missions, not other field updates
      if (Object.keys(req.body).length > 1 || !req.body.status) {
        return res.status(400).json({ message: 'Cannot update mission details while in progress. Only status changes are allowed.' });
      }
    }

    // If changing the drone, verify it's available
    if (req.body.drone && req.body.drone !== mission.drone.toString()) {
      const newDrone = await Drone.findById(req.body.drone);
      if (!newDrone) {
        return res.status(404).json({ message: 'Selected drone not found' });
      }

      if (newDrone.status !== 'available') {
        return res.status(400).json({ message: 'Selected drone is not available' });
      }

      // Check if new drone is already assigned to another mission at this time
      const missionDateTime = req.body.schedule?.dateTime 
        ? new Date(req.body.schedule.dateTime) 
        : mission.schedule.dateTime;
        
      const overlappingMissions = await Mission.find({
        drone: req.body.drone,
        _id: { $ne: req.params.id }, // Exclude current mission
        'schedule.dateTime': { $eq: missionDateTime },
        status: { $in: ['scheduled', 'in-progress'] }
      });

      if (overlappingMissions.length > 0) {
        return res.status(400).json({ 
          message: 'The selected drone is already assigned to another mission at this time' 
        });
      }
    }

    // Check if status is being updated to in-progress
    if (req.body.status === 'in-progress' && mission.status !== 'in-progress') {
      // Update drone status to in-mission
      await Drone.findByIdAndUpdate(mission.drone, { status: 'in-mission' });
    }
    
    // Check if status is changing from in-progress to completed or aborted
    if (mission.status === 'in-progress' && 
        ['completed', 'aborted'].includes(req.body.status)) {
      // Set drone back to available
      await Drone.findByIdAndUpdate(mission.drone, { status: 'available' });
    }

    const updatedMission = await Mission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('drone', 'name model serialNumber');

    res.status(200).json(updatedMission);
  } catch (error) {
    console.error('Error updating mission:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a mission
// @route   DELETE /api/missions/:id
// @access  Private
const deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    // Check if user has permission to delete this mission
    if (mission.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this mission' });
    }

    // Cannot delete missions that are already in progress
    if (mission.status === 'in-progress') {
      return res.status(400).json({ message: 'Cannot delete a mission that is in progress' });
    }

    await mission.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Mission removed' });
  } catch (error) {
    console.error('Error deleting mission:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMission,
  getMissions,
  getMissionById,
  updateMission,
  deleteMission
};