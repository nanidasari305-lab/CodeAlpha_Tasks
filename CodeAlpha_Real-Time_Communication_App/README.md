# WeMeet - Real-Time Communication Web Application

A full-stack zoom-like web application built with the MERN stack (MongoDB, Express, React, Node.js) featuring real-time video conferencing, screen sharing, in-meeting chat, digital whiteboard, and file sharing.

## Features Built
- **Authentication**: Secure JWT-based Login and Registration.
- **Video Conferencing**: Real-time WebRTC mesh network P2P video calls.
- **Screen Sharing**: Easily toggle to share your screen with participants.
- **Real-Time Chat**: Socket.io powered instant messaging within a meeting room.
- **Digital Whiteboard**: Collaborative drawing canvas that syncs across all users in the room.
- **File Sharing**: Upload and download files securely within the meeting room.
- **Modern UI**: Polished Dark Mode interface using Tailwind CSS.

## Setup Instructions

### Prerequisites
- Node.js installed (v16+)
- MongoDB installed and running locally on standard port (27017)

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure you have a `.env` file based on `.env.example`.
4. Start the backend server:
   ```bash
   node server.js
   ```
   *The server will run on http://localhost:5000*

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at http://localhost:5173*

## Usage
1. Open http://localhost:5173 in your browser.
2. Sign up for a new account.
3. From the Dashboard, Create a new Meeting Room.
4. Copy the unique Room ID from the top bar.
5. Open another browser window (or incognito mode), sign up as a different user, and use the Room ID to Join the Meeting.
6. Test your Webcam, Audio, Screen Share, Chat, collaborative Whiteboard, and file sharing capabilities!
