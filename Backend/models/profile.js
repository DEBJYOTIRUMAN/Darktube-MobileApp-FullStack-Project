import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { APP_URL } from "../config";

const profileSchema = new Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    profilePic: {
      type: String,
      required: true,
      get: (image) => {
        return `${APP_URL}/${image.replace("\\", "/")}`;
      },
    },
    followers: { type: Array, required: true },
    following: { type: Array, required: true }
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);

export default mongoose.model("Profile", profileSchema, "profiles");
