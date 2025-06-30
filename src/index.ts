import express, { Request, Response } from "express";
import { ENV } from "./configs/env";
import { connectDB } from "./configs/db";
import cors from 'cors';
import { clerkMiddleware } from "@clerk/express";


const app = express();
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello Kumar..."
  })
})

const PORT = ENV.PORT;

app.listen(PORT, async () => {
  console.log(`Server is running on: http://localhost:${PORT}`)
  await connectDB();
})