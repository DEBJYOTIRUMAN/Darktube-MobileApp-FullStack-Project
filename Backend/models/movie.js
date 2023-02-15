import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { APP_URL } from "../config";

const movieSchema = new Schema(
  {
    title: { type: String, required: true },
    movieUrl: {
      type: String,
      required: true,
      get: (movie) => {
        return `${APP_URL}/${movie.replace("\\", "/")}`;
      },
    },
    thumbnailUrl: {
      type: String,
      required: true,
      get: (thumbnail) => {
        return `${APP_URL}/${thumbnail.replace("\\", "/")}`;
      },
    },
    likes: { type: Array, required: true },
    genres: { type: Array, required: true },
    release: { type: Number, required: true }
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);

export default mongoose.model("Movie", movieSchema, "movies");
