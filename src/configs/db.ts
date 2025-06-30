import mongoose from "mongoose"
import { ENV } from "./env"

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI)
    console.log("Connected Successfully: ", conn.connection.host)
  } catch (error) {
    console.log("Error connecting to mongoDB", error)
    process.exit(1)
  }
}