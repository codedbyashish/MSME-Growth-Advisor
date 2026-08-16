import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

// 1. Load environment variables first
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "MSME Growth Advisor API is active",
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found - ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

// 2. Connect to MongoDB Atlas first
await connectDB();

// 3. Only start listening after MongoDB is successfully connected
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
