# Full Stack Real-Time Chat Application

A modern, production-ready chat application built with React, Node.js, Express, PostgreSQL, Sequelize, Socket.IO, and JWT authentication.

## 🚀 Features

- **Real-time messaging** with Socket.IO
- **User authentication** with JWT
- **Room-based conversations**
- **Online status tracking**
- **Typing indicators**
- **Message history with pagination**
- **Responsive design** with Tailwind CSS
- **File upload support** (ready for implementation)
- **Private rooms**
- **User roles and permissions**
- **Message editing and deletion** (backend ready)
- **Notification system**
- **Docker support**

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI framework
- **Socket.IO Client** - Real-time updates
- **Axios** - HTTP client
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Context API** - State management

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd fullstack-chat-app
```

### 2. Backend Setup
```bash
cd server
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npm run db:create
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Copy environment file
cp .env.example .env
# Edit .env if needed

# Start development server
npm start
```

### 4. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Default admin credentials: admin@chatapp.com / admin123

## 🐳 Docker Setup

### Using Docker Compose
```bash
# Clone the repository
git clone <repository-url>
cd fullstack-chat-app

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
fullstack-chat-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── ...
│   ├── Dockerfile
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── socket/           # Socket.IO handlers
│   ├── migrations/       # Database migrations
│   ├── seeders/          # Database seeders
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Chat
- `GET /api/chat/rooms` - Get all rooms
- `POST /api/chat/rooms` - Create new room
- `POST /api/chat/rooms/:id/join` - Join room
- `GET /api/chat/rooms/:id/messages` - Get room messages
- `GET /api/chat/users/online` - Get online users

## 🔌 Socket Events

### Client to Server
- `joinRoom(roomId)` - Join a room
- `leaveRoom(roomId)` - Leave a room
- `sendMessage(data)` - Send message
- `typing(data)` - Start typing
- `stopTyping(data)` - Stop typing

### Server to Client
- `newMessage(message)` - New message received
- `userOnline(user)` - User came online
- `userOffline(user)` - User went offline
- `userTyping(data)` - User started typing
- `userStoppedTyping(data)` - User stopped typing
- `onlineUsers(users)` - List of online users

## 🔧 Development

### Backend Development
```bash
cd server

# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run database migrations
npm run db:migrate

# Run database seeders
npm run db:seed

# Run tests
npm test
```

### Frontend Development
```bash
cd client

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
npm run test:coverage
```

### Frontend Tests
```bash
cd client
npm test
```

## 🚀 Deployment

### Production Build
```bash
# Backend
cd server
npm install --production
npm start

# Frontend
cd client
npm run build
# Serve build files with nginx or similar
```

### Environment Variables

#### Server (.env)
```env
NODE_ENV=production
PORT=5000
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://your-domain.com
```

#### Client (.env)
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_SOCKET_URL=https://your-api-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

If you have any questions or issues, please open an issue on GitHub.
```

## ✨ Future Enhancements

- [ ] Voice messages
- [ ] Video calls
- [ ] Screen sharing
- [ ] Message reactions
- [ ] Message threads
- [ ] Custom emojis
- [ ] Message search
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Bot integration
- [ ] File sharing
- [ ] Message encryption

---

Built with ❤️ using modern web technologies

```
