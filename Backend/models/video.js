import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { APP_URL } from "../config";

const videoSchema = new Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    title: { type: String, required: true },
    videoUrl: {
      type: String,
      required: true,
      get: (video) => {
        return `${APP_URL}/${video.replace("\\", "/")}`;
      },
    },
    thumbnailUrl: {
      type: String,
      required: true,
      get: (thumbnail) => {
        return `${APP_URL}/${thumbnail.replace("\\", "/")}`;
      },
    },
    profilePic: { type: String, required: true },
    likes: { type: Array, required: true },
    comments: { type: Array, required: true },
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);

export default mongoose.model("Video", videoSchema, "videos");
