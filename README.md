# 🚗 DriveEase — Ride Booking & Driver Platform

A full-stack real-time ride-booking platform (like Ola/Uber) built with React, Node.js, Express, MongoDB, and Socket.IO.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS + Framer Motion + Leaflet + React Router
- **Backend:** Node.js + Express.js + MongoDB (Mongoose)
- **Real-Time:** Socket.IO

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running on `localhost:27017`

### 1. Backend
```bash
cd backend
npm install
node seed.js        # Seeds sample data
npm run dev          # Starts on port 5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev          # Starts on port 5173
```

### 3. Open
Visit `http://localhost:5173`

## Test Credentials
| Role   | Phone        | Password      |
|--------|-------------|---------------|
| User   | 9876543210  | password123   |
| Driver | 9876543220  | password123   |

## Features
- JWT authentication with role-based access (User / Driver)
- GPS-based nearby driver discovery with filters
- Two booking modes: select driver or auto-match
- Route display on OpenStreetMap with distance & fare calculation
- Insurance add-ons (Mini ₹10 / Premium ₹20)
- Real-time driver location tracking via Socket.IO
- Complete booking lifecycle (create → accept → start → complete)
- Rating & feedback system
- Driver dashboard with online/offline toggle
- Ride history for both users and drivers

## API Endpoints
| Method | Endpoint                      | Description              |
|--------|-------------------------------|--------------------------|
| POST   | /api/auth/signup              | Register                 |
| POST   | /api/auth/login               | Login                    |
| GET    | /api/auth/me                  | Current user profile     |
| GET    | /api/drivers/nearby           | Nearby drivers (geo)     |
| GET    | /api/drivers/all              | All drivers              |
| POST   | /api/drivers/update-location  | Update driver location   |
| POST   | /api/drivers/toggle-status    | Go online/offline        |
| POST   | /api/bookings/create          | Create booking           |
| GET    | /api/bookings/:id             | Get booking              |
| POST   | /api/bookings/:id/accept      | Driver accepts           |
| POST   | /api/bookings/:id/start       | Start ride               |
| POST   | /api/bookings/:id/complete    | Complete ride            |
| POST   | /api/bookings/:id/cancel      | Cancel ride              |
| POST   | /api/bookings/:id/rate        | Rate ride                |
