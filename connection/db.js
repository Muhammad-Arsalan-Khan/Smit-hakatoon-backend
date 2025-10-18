import mongoose from "mongoose"

export async function connectMongoDB()  {
 try {
    return await mongoose.connect(process.env.MONGO_URL)
  } catch (err) {
    console.error("MongoDB connection error:", err)
    throw err
  }
}