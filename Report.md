# Reddit Implementation in MERN Stack

## Project Details
- **Name**: Siddharth Kapatel 
- **Roll No**: 12202080501055 
- **Branch**: IT  


## Introduction
This project implements a Reddit-like application using the MERN stack. The application is containerized using Docker and uses Nginx as the web server to host the application within the container.

The core features include:
- Login and Registration with input validation.
- Password encryption using bcrypt.js.
- Protected routes with JWT-based authentication.
- Dynamic dashboards and pages for managing users, sub-greddiits, and posts.
- Graph-based statistical insights using ChartJS.
- Advanced search and filter functionality with Fuse.js.
- Robust error handling and I/O validation.

---

## Features

### 1. **Authentication**
- **Sign-Up and Login**:
  - Sign-up and login forms validate inputs and disable buttons for invalid entries.
  - Passwords are encrypted and stored securely using bcrypt.js.
- **Post-Login Flow**:
  - On successful authentication, users are shown a welcome message and redirected to the Dashboard.
  - Logout functionality is implemented.
- **Protected Routes**:
  - All routes are secured; unauthenticated users are redirected.

### 2. **Dashboard**
- A fully functional navbar with icon-based navigation links.

### 3. **Profile Page**
- Users can edit their details except for the email field.
- Followers and Following lists are displayed, with options to remove connections.

### 4. **My Sub Greddiits Page**
- A button to create new sub-greddiits with input validation.
- Each sub-greddiit has unique names.
- Details and functionality include:
  

### 5. **Sub Greddiit Page**
- **Navbar**: Links to Users, Stats.
- **Users Page**:
  - Moderators can view two distinct tables of users with options to manage them.
- **Stats Page**:
  - Four graphs representing daily new members, reported reports, deleted reports, and general trends using ChartJS.


### 6. **All Sub Greddiits Page**
- **Search Bar**:
  - Implemented using Fuse.js for fuzzy searching.
- **Tag-Based Filtering**:
  - Multiple tag inputs allowed; posts containing any of the tags are displayed.


### 7. **Subgreddiit-Specific Page**
- Displays basic details and profile image for the sub-greddiit.
- **Create Post**:
  - Members can create posts with banned keywords replaced by `*`.
  - Alerts shown if banned keywords are present.
- **Post Interaction**:
  - Comment, upvote/downvote, save, and follow functionalities are available.
  - Saved posts appear on the "Saved Posts" page.



---

## Technical Details

### Backend
- Password encryption using bcrypt.js.
- Routes protected using JWT-based authentication.
- MongoDB used to store data for users, posts, sub-greddiits, and reports.
- Proper I/O validation and error handling for all API endpoints.

### Frontend
- React components styled with Material-UI.
- ChartJS for graph-based statistical representations.
- Fuse.js for advanced search functionality.
- Dynamic input validation in forms.

### Deployment
- Application containerized using Docker.
- Nginx used as a reverse proxy for hosting.

---

## Bonus Features
- **Fuzzy Search**: Implemented with Fuse.js.
- **Graphs and Stats**: Interactive graphs for insights using ChartJS.
- **Integration with OpenAI API**: The OpenAI API is integrated to filter and sanitize input text while posting, ensuring content appropriateness and quality.

---


