// server/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Route imports
const authRoutes = require('./routes/authRoutes');
const missionRoutes = require('./routes/missionRoutes');
const droneRoutes = require('./routes/droneRoutes'); // Add drone routes

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/drones', droneRoutes); // Add drone routes

// Basic route for testing server
app.get('/', (req, res) => {
  res.json({ message: 'Drone Survey API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Server error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});