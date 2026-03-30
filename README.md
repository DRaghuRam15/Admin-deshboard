# Admin Dashboard with Analytics & Reporting

This is a MEAN stack application for an Admin Dashboard with Analytics & Reporting.

## Tech Stack
- **Frontend**: Angular
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Charts**: Chart.js with ng2-charts

## Features
- User authentication and role-based authorization
- Dashboard with analytics metrics and charts
- User management for admins
- Responsive design

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- Angular CLI

### Backend Setup
1. Navigate to the `backend` folder:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the `backend` folder with:
   ```
   MONGO_URI=mongodb://localhost:27017/admin-dashboard
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```
4. Start MongoDB if not running.
5. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the Angular development server:
   ```
   npm start
   ```

### Usage
- Open your browser and go to `http://localhost:4200`
- Login with admin credentials (create via backend registration or seed data)
- Access dashboard and user management

## Screenshots
(Add screenshots here)

## Version Details
- Node.js: 18.17.0
- Angular: 17.0.0
- MongoDB: 7.0