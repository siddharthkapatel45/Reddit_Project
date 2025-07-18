# Greddiit

Greddiit is a  web portal inspired by Reddit, designed to provide a full-fledged social media experience. It allows users to register, create and manage posts, and moderate communities (Sub Greddiits). Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), Greddiit ensures a scalable, secure, and responsive platform with  and Nginx for efficient content delivery and deployment.

---

## Key Features

- **User Authentication**: Secure login and registration with hashed passwords and token-based authentication.
- **Post and Comment System**: Create, view, upvote, and manage posts with multi-level commenting.
- **Community Moderation**: Moderators can manage Sub Greddiits, visualize through charts.
- **Advanced Search and Filtering**: Fuzzy search and filters  for an optimized browsing experience.
  

---

## Getting Started

### Prerequisites
-  and  Compose installed on your system.

### Installation and Running

#### Build  Services:
```bash
sudo -compose build
```

#### Run  Services:
```bash
sudo -compose up
```

#### Access the application:
Open your web browser and navigate to `localhost:8000`.

---

## Directory Structure
```
.
├── backend
│   ├── package.json
│   ├── server.js
│   └── src
│       ├── authentications
│       │   ├── Auth.js
│       ├── models
│       │   ├── Comment.js
│       │   ├── Community.js
│       │   └── Post.js
│       ├── routes
│       │   ├── CreateComment.js
│       │   ├── CreateCommuity.js
|       |   |--CreatePost.js
|       |   |--Follow.js
|       |   |--PostRoute.js
│       │   └── Profile.js
        |
│       └── uploads
│           ├── sidd.jpg
│           
├── -compose.yml
├── frontend
│   ├── file
│   ├── package.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── login-background.webp
│   │   └── robots.txt
│   └── src
│       ├── App.js
│       ├── index.js
│       ├── assets
│       │   ├── css
│       │   └── images
│       ├── components
│       │   ├── Accept.js
│       │   ├── BlogCard.js
│       │   ├── Comm.js
│       │   ├── Comment.js
│       │   ├── Community_members.js
│       │   ├── Container.js
│       │   ├── Create.js
│       │   ├── CreateCommunity.js
│       │   ├── Edit_Profile.js
│       │   ├── Home.js
│       │   ├── JobPost.js
│       │   ├── Login.js
│       │   ├── Navbar.js
│       │   ├── Navbar_OG.js
│       │   ├── Post.js
│       │   ├── Post1.js
│       │   ├── Profile.js
│       │   ├── ProfileCard.js
│       │   └── Signup.js
│       
└── nginx
    └── default.conf

---
```
## Detailed Features

### User Management
- **Login & Registration**: Users can register and log in with unique email-based identification. Passwords are securely hashed, and sessions persist even after browser restarts.
- **Profile Management**: Users can view and edit their profiles, including managing followers and following lists.

### Sub Greddiits (Communities)
- **My Sub Greddiits**: Users can create and manage their Sub Greddiits, view community stats, and moderate content.
- **Moderation Tools**: monitor community growth and activity through detailed stats.

### Posts & Comments
- **Create and Manage Posts**: Users can create posts within Sub Greddiits, upvote or downvote posts, and engage in multi-level commenting.


### Advanced Functionality
- **Search & Filtering**: Enhanced search functionality with fuzzy search, filters by tags, and nested sorting based on multiple criteria.
- **Integration via OPENAI API**: Banned keywords not saved in post.
- **Banned Keywords**: Posts containing banned words are flagged, and inappropriate content is automatically replaced with asterisks.

### Miscellaneous
- **Input Validation**: Extensive validation on both frontend and backend, ensuring secure and accurate data handling.
- **Protected Routes**: API routes are protected, preventing unauthorized access.
- **Shortcuts**: Implemented keyboard shortcuts for quick navigation within the platform.

---

## Deployment

Greddiit is fully Doker containerized using , with separate containers for the backend, frontend, and Nginx, ensuring a seamless deployment process. The services are orchestrated via `-compose` to maintain a scalable and efficient infrastructure.

