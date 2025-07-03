import { clerkMiddleware } from "@clerk/express";
import cors from 'cors';
import express from "express";
import { connectDB } from "./configs/db.js";
import { ENV } from "./configs/env.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";

const app = express();
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello Kumar..."
  })
})

app.use("/users", userRoutes)
app.use("/posts", postRoutes)

// error handler middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error: ", err)
  res.status(500).json({
    error: err.message || "Internal server error"
  })
})

const PORT = ENV.PORT;

app.listen(PORT, async () => {
  console.log(`Server is running on: http://localhost:${PORT}`)
  await connectDB();
})