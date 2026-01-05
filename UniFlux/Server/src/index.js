import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import { httpServer } from "./socket/socketServer.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

httpServer.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
