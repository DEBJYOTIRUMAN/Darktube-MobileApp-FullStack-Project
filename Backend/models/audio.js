import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { APP_URL } from "../config";

const audioSchema = new Schema(
  {
    name: { type: String, required: true },
    audioUrl: {
      type: String,
      required: true,
      get: (audio) => {
        return `${APP_URL}/${audio.replace("\\", "/")}`;
      },
    },
    audioThumbnail: {
      type: String,
      required: true,
      get: (audioThumbnail) => {
        return `${APP_URL}/${audioThumbnail.replace("\\", "/")}`;
      },
    },
    album: { type: String, required: true },
    likes: { type: Array, required: true },
    artists: { type: Array, required: true },
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);

export default mongoose.model("Audio", audioSchema, "audios");
