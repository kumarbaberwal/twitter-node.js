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

const startServer = async () => {
  try {
    await connectDB();

    // listen for local development
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));
    }
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();


// Export for vercel
export default app