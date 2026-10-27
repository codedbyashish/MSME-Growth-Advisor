import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import seedRoutes from "./routes/seedRoutes.js";
import advisorRoutes from "./routes/advisorRoutes.js";
import importRoutes from "./routes/importRoutes.js";

// 1. Load environment variables first
dotenv.config();

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/advisor", advisorRoutes);
app.use("/api/import", importRoutes);
app.use("/api/seed", seedRoutes);

// Health check endpoints
app.get(["/", "/health", "/api/health"], (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "MSME Growth Advisor API is active",
    timestamp: new Date().toISOString(),
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
