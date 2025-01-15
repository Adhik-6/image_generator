import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  name: { type: String },
  prompt: { type: String, required: true },
  photo: { type: String, required: true }
})

export const posts = mongoose.model("post", postSchema)