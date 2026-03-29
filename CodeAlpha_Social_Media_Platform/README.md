# Mini Social Media Platform

A full-stack social media web application built with Node.js, Express, MongoDB, and Vanilla HTML/CSS/JS.

## Features
- JWT-based User Authentication
- Create, Read, Delete Posts
- Like/Unlike Posts
- Comment on Posts
- Follow/Unfollow Users
- User Profiles & Profile Pictures
- Dark/Light Mode
- Modern, Responsive UI

## Prerequisites
- Node.js installed
- MongoDB installed and running locally on `mongodb://localhost:27017`

## Setup & Running Locally

1. **Install Backend Dependencies**
   Navigate to the `backend/` folder and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   Ensure `backend/.env` has the correct `MONGODB_URI`. The default is `mongodb://localhost:27017/mini-social-media`.

3. **Seed Database (Optional but Recommended)**
   Populate the database with sample users, posts, and comments:
   ```bash
   node seed.js
   ```
   *Sample Login:*
   - **Email:** john@example.com
   - **Password:** password123

4. **Start the Backend Server**
   ```bash
   cd backend
   node server.js
   ```
   The server will run on `http://localhost:5000`.

5. **Start the Frontend**
   You can serve the `frontend/` directory using any static file server like `Live Server` in VSCode, or using python:
   ```bash
   cd frontend
   npx serve .
   ```
   Then open the provided local URL in your browser.

## Tech Stack
- **Frontend:** HTML5, Vanilla CSS (Custom Properties, Grid, Flexbox), Vanilla JavaScript (Fetch API)
- **Backend:** Node.js, Express.js, Mongoose, Multer (for uploads), JWT, bcryptjs

## Limitations
- This is a 'mini' version meant for demonstration purposes. File uploads are stored locally in the `backend/uploads/` folder.
