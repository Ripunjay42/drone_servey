# Drone Survey Management Platform

A comprehensive web application for drone survey mission planning, fleet management, and real-time mission monitoring.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Frontend](#frontend)
  - [Technologies](#frontend-technologies)
  - [Setup](#frontend-setup)
  - [Environment Variables](#frontend-environment-variables)
  - [Running the Frontend](#running-the-frontend)
- [Backend](#backend)
  - [Technologies](#backend-technologies)
  - [Setup](#backend-setup)
  - [Environment Variables](#backend-environment-variables)
  - [Running the Backend](#running-the-backend)
  - [API Documentation](#api-documentation)
- [Design Decisions](#design-decisions)
- [AI Tools Integration](#ai-tools-integration)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)

## Overview

The Drone Survey Management Platform is a full-stack web application designed to streamline the planning, execution, and monitoring of drone survey missions. It provides a user-friendly interface for drone operators and managers to schedule missions, manage drone fleets, monitor ongoing operations, and view completed survey reports.

## Features

- **User Authentication**: Secure login and registration with role-based access control
- **Dashboard**: Overview of drone fleet and mission statistics
- **Mission Planning**: Intuitive interface for creating and scheduling survey missions
- **Fleet Management**: Comprehensive drone inventory management
- **Mission Monitoring**: Real-time tracking of ongoing missions with visualization
- **Survey Reports**: Detailed mission reports with survey area calculations
- **Interactive Maps**: Advanced mapping capabilities for defining survey areas

## Architecture

The application follows a modern client-server architecture:

- **Frontend**: React-based single-page application (SPA) with component-based UI
- **Backend**: Node.js/Express RESTful API server
- **Database**: MongoDB for flexible document-based storage
- **State Management**: Zustand for simplified frontend state management
- **Maps**: Mapbox for interactive mapping and geospatial capabilities

## Technologies Used

### Prerequisites for Both Frontend and Backend

- Node.js (v18+)
- npm (v9+) or yarn
- Git

## Frontend

### Frontend Technologies

- React 19
- React Router 7
- Tailwind CSS 4
- Zustand (State Management)
- Mapbox GL JS
- Chart.js
- Vite (Build Tool)

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Ripunjay42/drone_survey_management.git
   cd drone_survey_management
   ```

2. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

### Frontend Environment Variables

Create a `.env` file in the client directory with the following variables:
```
VITE_API_URL=http://localhost:5000/api
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

- `VITE_API_URL`: URL of the backend API
- `VITE_MAPBOX_ACCESS_TOKEN`: Your Mapbox access token for maps functionality

### Running the Frontend

#### Development Mode

```bash
cd client
npm run dev
```

Access the frontend at: http://localhost:5173



## Backend

### Backend Technologies

- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt (Password Hashing)

### Backend Setup

1. Prerequisites specific to backend:
   - MongoDB (v5+)

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

### Backend Environment Variables

Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/drone_survey (Your Mongodb Uri)
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

- `PORT`: Port for the server to run on
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Environment mode (development/production)

### Running the Backend

#### Development Mode

```bash
cd server
npm run dev
```

The backend API will be available at: http://localhost:5000

#### Production Mode

```bash
cd server
npm start
```

### API Documentation

#### Authentication Endpoints
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate user and get token

#### Default Admin Credentials
- **Email**: admin12@gmail.com
- **Password**: admin@12

#### Drones Endpoints
- `GET /api/drones`: Get all drones
- `POST /api/drones`: Create a new drone
- `GET /api/drones/:id`: Get drone by ID
- `PUT /api/drones/:id`: Update drone
- `DELETE /api/drones/:id`: Delete drone
- `GET /api/drones/available`: Get available drones for scheduling

#### Missions Endpoints
- `GET /api/missions`: Get all missions
- `POST /api/missions`: Create a new mission
- `GET /api/missions/:id`: Get mission by ID
- `PUT /api/missions/:id`: Update mission
- `DELETE /api/missions/:id`: Delete mission

## Design Decisions

### React Component Structure
The frontend follows a modular component-based architecture. Components are organized into:
- **Container Components**: Manage state and data fetching logic
- **Presentational Components**: Focus solely on UI rendering with props
This separation of concerns improves code maintainability and testing capabilities.

### State Management
The application uses Zustand instead of Redux for state management. Zustand provides a simpler API with less boilerplate while maintaining the benefits of a central store. This choice led to more concise code and easier maintenance.

### Component Architecture
Components are organized by feature rather than by type, following a domain-driven design approach. This makes the codebase more navigable and facilitates better code reuse.

### Maps Integration
Mapbox was chosen because it offers more flexible and customizable mapping capabilities, especially for drawing custom polygons and flight paths for drone missions.

### Authentication Strategy
JWT-based authentication was implemented for its stateless nature, which works well with the React frontend. Role-based access control ensures users can only access appropriate features.

### Data Modeling
MongoDB was selected for its flexibility in storing complex geospatial data (for survey areas) and nested objects (for mission parameters). The schema design allows for easy expansion as new features are added.

### Responsive Design
Tailwind CSS was used to implement a mobile-first responsive design, ensuring the application works well on various devices including tablets that might be used in the field.

### Express MVC Architecture
The backend follows the Model-View-Controller (MVC) pattern:
- **Models**: Mongoose schemas defining data structure and database interactions
- **Controllers**: Handle request processing, business logic, and response formation
- **Routes**: Define API endpoints and connect them to appropriate controllers
This structured approach facilitates code organization, maintenance, and scalability.

## AI Tools Integration

Several AI tools were integrated into the development workflow to enhance productivity:

### GitHub Copilot
- **Usage**: Code completion and generation throughout the project
- **Impact**: Increased development speed by approximately 40%, especially for repetitive patterns and boilerplate code
- **Examples**: 
  - Generated common React component structures
  - Suggested MongoDB schema definitions
  - Helped create complex map rendering functions

### ChatGPT for Code Review
- **Usage**: Code review and optimization suggestions
- **Impact**: Identified potential bugs and performance issues before they reached production
- **Examples**:
  - Suggested optimizations for map rendering
  - Identified issues in authentication middleware
  - Recommended better patterns for async operations

### Claude 3.7
- **Usage**: complex problem-solving during development
- **Impact**: Improved code quality and architecture through detailed contextual understanding
- **Examples**:
  - Designed complex database schemas with optimized relationships
  - Provided comprehensive security recommendations for API endpoints
  - Assisted with optimizing performance bottlenecks in the application

## Project Structure

```
drone_servey_management/
├── client/                  # Frontend application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   ├── drones/      # Drone management components
│   │   │   ├── layout/      # Layout components
│   │   │   ├── map/         # Map-related components
│   │   │   ├── missions/    # Mission planning components
│   │   │   ├── monitoring/  # Mission monitoring components
│   │   │   └── reports/     # Survey report components
│   │   ├── services/        # API service functions
│   │   ├── stores/          # Zustand stores
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # Application entry point
│   ├── .env                 # Environment variables
│   └── package.json         # Dependencies and scripts
│
├── server/                  # Backend application
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── .env                 # Environment variables
│   ├── server.js            # Server entry point
│   └── package.json         # Dependencies and scripts
│
└── README.md                # Project documentation
```

## Future Enhancements

- Real-time communication with drones using WebSockets
- Integration with weather APIs for mission planning
- Image processing for survey data analysis
- Advanced reporting with data visualization
