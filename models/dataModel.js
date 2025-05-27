import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  id: Number,
  category: String,
  description: String,
  title: String,
  image: String, // Main image
  price: Number,
  rating: Number,
});

// Prevent model overwrite error in development
const Data = mongoose.models.Data || mongoose.model("Data", dataSchema);

export default Data;
