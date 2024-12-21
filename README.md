# Greddit
Greddiit is a Dockerized web portal inspired by Reddit, designed to provide a full-fledged social media experience. It allows users to register, create and manage posts, and moderate communities (Sub Greddiits). Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), Greddiit ensures a scalable, secure, and responsive platform with Docker and Nginx for efficient content delivery and deployment.

Key Features
User Authentication: Secure login and registration with hashed passwords and token-based authentication.
Post and Comment System: Create, view, upvote, and manage posts with multi-level commenting.
Community Moderation: Moderators can manage Sub Greddiits, handle reports, visualize through charts and moderate users and content.
Advanced Search and Filtering: Fuzzy search, filters, and nested sorting for an optimized browsing experience.
Dockerized Deployment: Scalable and efficient deployment using Docker and Nginx.
Getting Started
Prerequisites
Docker and Docker Compose installed on your system.
Installation and Running
Build Docker Services:

$ sudo docker-compose build
Run Docker Services:

$ sudo docker-compose up
Access the application in your web browser via localhost:8000.

Directory Structure
.
├── backend
│   ├── Dockerfile
│   └── server.js
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── login-background.webp
│   │   └── robots.txt
│   └── src
│       ├── App.js
│       ├── index.js
│       ├── app.css   
│       ├── index.css
│       └── MyComponents
│           ├── About.js
│           ├── AddTodo.js
│           ├── blockedusers.js
│           ├── Content.js
│           ├── Dashboard_navbar.js
│           ├── Dashboard_navbar.css
│           ├── Dashboard.js
│           ├── Deposits.js
│           ├── Follower.js
│           ├── Follower.css
│           ├── Following.js
│           ├── Following.css
│           ├── Footer.js
│           ├── Header.js
│           ├── Homedash.js
│           ├── joiningpage.js
│           ├── joiningpage.css
│           ├── loader.js
│           ├── loader.css
│           ├── Login.js
│           ├── Modal.js
│           ├── Profile
│           ├── Protected.js
│           ├── Reported.js
│           ├── SavedPosts.js
│           ├── Stats
│           ├── SubgreddiitCheck.js
│           ├── SubgreddiitPage.js
│           ├── MysubGreddig.js
│           ├── users.js
│           ├── welcome.js
│           └── SubgreddiitUsers.js

└── nginx
    └── default.conf
Detailed Features
User Management
Login & Registration: Users can register and log in with unique email-based identification. Passwords are securely hashed, and sessions are persistent even after browser restarts.
Profile Management: Users can view and edit their profiles, including managing followers and following lists.
Sub Greddiits (Communities)
My Sub Greddiits: Users can create and manage their Sub Greddiits, view community stats, and moderate content.
Moderation Tools: Manage user reports, handle join requests, and monitor community growth and activity through detailed stats.
Posts & Comments
Create and Manage Posts: Users can create posts within Sub Greddiits, upvote or downvote posts, and engage in multi-level commenting.
Report Management: Moderators can address reports by ignoring, deleting posts, or banning users. Reports are automatically removed after 10 days.
Advanced Functionality
Search & Filtering: Enhanced search functionality with fuzzy search, filters by tags, and nested sorting based on multiple criteria.
Saved Posts: Users can save and manage their favorite posts across Sub Greddiits.
Banned Keywords: Posts containing banned words are flagged, and inappropriate content is automatically replaced with asterisks.
Miscellaneous
Input Validation: Extensive validation on both frontend and backend, ensuring secure and accurate data handling.
Protected Routes: API routes are protected, preventing unauthorized access.
Shortcuts: Implemented keyboard shortcuts for quick navigation within the platform.
Deployment
Greddiit is fully containerized using Docker, with separate containers for the backend, frontend, and Nginx, ensuring a seamless deployment process. The services are orchestrated via docker-compose to maintain a scalable and efficient infrastructure.
