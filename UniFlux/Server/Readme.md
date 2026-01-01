# UniFlux Server

Backend server for UniFlux - AI-Powered Smart University Management & Timetable Optimization Platform.

## 🚀 Features

- RESTful API for university management
- User authentication with JWT
- MongoDB database integration
- TypeScript support
- CORS enabled for frontend integration

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

## 🔧 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/uniflux-server.git
   cd uniflux-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/uniflux
   JWT_SECRET=your_jwt_secret_key
   ```

4. Build the project:
   ```bash
   npm run build
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 5000).

## 📁 Project Structure

```
src/
├── controllers/     # Route controllers
├── db/             # Database configuration
├── middleware/     # Custom middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── utils/          # Utility functions
├── constant.js     # Constants
├── index.js        # Application entry point
└── server.js       # Express app setup
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](../LICENSE) file for details.

## 🔗 Related Projects

- [UniFlux Client](https://github.com/your-username/uniflux-client) - Frontend React application
