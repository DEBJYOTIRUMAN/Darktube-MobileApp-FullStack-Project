import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { APP_URL } from "../config";

const postSchema = new Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    caption: { type: String, required: true },
    imageUrl: {
      type: String,
      required: true,
      get: (image) => {
        return `${APP_URL}/${image.replace("\\", "/")}`;
      },
    },
    profilePic: { type: String, required: true },
    likes: { type: Array, required: true },
    comments: { type: Array, required: true },
    videoUrl: {
      type: String,
      get: (video) => {
        if (!video) {
          return;
        }
        return `${APP_URL}/${video.replace("\\", "/")}`;
      },
    },
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);

export default mongoose.model("Post", postSchema, "posts");
