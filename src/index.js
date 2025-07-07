import { clerkMiddleware } from "@clerk/express";
import cors from 'cors';
import express from "express";
import { connectDB } from "./configs/db.js";
import { ENV } from "./configs/env.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comments.route.js";
import notificationRoutes from "./routes/notification.route.js";
import { arcjetMiddleware } from "./middlewares/arcjet.middleware.js";

const app = express();
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())
// app.use(arcjetMiddleware)
await connectDB();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello Kumar..."
  })
})

app.use("/users", userRoutes)
app.use("/posts", postRoutes)
app.use("/comments", commentRoutes)
app.use("/notifications", notificationRoutes)

// error handler middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error: ", err)
  res.status(500).json({
    error: err.message || "Internal server error"
  })
})

const PORT = ENV.PORT;

app.listen(PORT, async () => {
  if (ENV.NODE_ENV !== "production") {
    console.log(`Server is running on: http://localhost:${PORT}`)
  }
})


// Export for vercel
export default app