import express, { Request, Response } from "express";
import { ENV } from "./configs/env";
import { connectDB } from "./configs/db";


const app = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello Kumar..."
  })
})

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`)
  connectDB();
})