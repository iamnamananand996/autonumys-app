import mongoose, { ConnectOptions } from "mongoose";

const uri = process.env.MONGODB_URI || "";
const clientOptions: ConnectOptions = {
  serverApi: {
    version: "1", // Correct type here
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(uri, clientOptions);
      console.log("Connected to MongoDB Atlas successfully.");
    } catch (error) {
      console.error("Failed to connect to MongoDB Atlas:", error);
      throw error;
    }
  }
};
