import dotenv from "dotenv";
import app from "./server.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
