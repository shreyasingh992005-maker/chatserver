import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import express from "express";
import cors from "cors";
import connectDb from "./database/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
const app=express();
app.use(express.json());
app.use(cors());
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
console.log("GMAIL:", process.env.gmail);
console.log("PASSWORD EXISTS:", !!process.env.password);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDb();
});