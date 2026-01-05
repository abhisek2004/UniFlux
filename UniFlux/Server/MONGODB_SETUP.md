# MongoDB Setup Guide

This guide will help you set up MongoDB for the UniFlux application.

## Option 1: Local MongoDB Installation

### Install MongoDB Community Edition

1. **Download MongoDB**:
   - Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Download the appropriate version for your operating system

2. **Install MongoDB**:
   - Follow the installation wizard for your OS
   - Make sure to install MongoDB Compass (optional but recommended)

3. **Start MongoDB Service**:
   - On Windows: MongoDB should start automatically after installation
   - You can also start it manually via Windows Services
   - Or use the command: `net start MongoDB`

4. **Verify Installation**:
   - Open a new terminal/command prompt
   - Run: `mongod --version`
   - You should see the MongoDB version

### Alternative: Using MongoDB with Docker

If you have Docker installed, you can run MongoDB in a container:

```bash
# Pull and run MongoDB container
docker run --name uniflux-mongo -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password -d mongo

# Connect to the container
docker exec -it uniflux-mongo mongo -u admin -p password --authenticationDatabase admin
```

## Option 2: MongoDB Atlas (Cloud)

### Create MongoDB Atlas Account

1. **Sign up** at [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. **Create a new cluster**
3. **Set up database user** with read/write permissions
4. **Whitelist your IP address** (or allow access from anywhere for development)
5. **Get connection string**

### Update Environment Variables

Replace the MongoDB connection string in `.env` file:

```env
# For MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/uniflux?retryWrites=true&w=majority
```

## Running the Application

Once MongoDB is running, you can:

1. **Start the server**:
   ```bash
   cd UniFlux/Server
   npm run dev
   ```

2. **Seed the database** with sample data:
   ```bash
   npm run seed
   ```

## Troubleshooting

### Common Issues:

1. **Connection Refused Error**:
   - Ensure MongoDB service is running
   - Check that port 27017 is not blocked by firewall

2. **Authentication Failed**:
   - Verify your database credentials are correct
   - Check that your IP address is whitelisted (for Atlas)

3. **Permission Issues**:
   - Make sure you have proper permissions to access the MongoDB installation
   - On Windows, try running the command prompt as Administrator

### Testing Connection:

You can test your MongoDB connection using the MongoDB shell:

```bash
# Connect to local MongoDB
mongo

# Connect to specific database
use uniflux

# Test by inserting a document
db.test.insertOne({test: "connection"})
```

## Environment Variables

Make sure your `.env` file in the Server directory contains:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/uniflux
JWT_SECRET=uniflux_secret_key
```

For MongoDB Atlas, the format would be:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/uniflux
```

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)
- [MongoDB University](https://university.mongodb.com/) (Free courses)