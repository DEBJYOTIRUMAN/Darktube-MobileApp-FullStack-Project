import { Profile, User } from "../models";
import Joi from "joi";
import multer from "multer";
import path from "path";
import CustomErrorHandler from "../services/CustomErrorHandler";
const userImage = "uploads/user.png";
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});
const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("profilePic"); // 5MB

const profileController = {
  async storeProfile(req, res, next) {
    let user;
    try {
      user = await User.findOne({ _id: req.user._id });
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }
    } catch (err) {
      return next(err);
    }

    let document;
    try {
      document = await Profile.create({
        userId: user._id,
        userName: user.name,
        profilePic: userImage,
        followers: [],
        following: [],
      });
    } catch (err) {
      return next(err);
    }
    res.status(200).json(document);
  },

  async updateProfilePic(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      const filePath = req.file.path;
      let user;
      try {
        user = await User.findOne({ _id: req.user._id });
        if (!user) {
          return next(CustomErrorHandler.notFound());
        }
      } catch (err) {
        return next(err);
      }

      let updateProfile;
      try {
        updateProfile = await Profile.findOneAndUpdate(
          { userId: user._id },
          {
            profilePic: filePath,
          },
          { new: true }
        );
      } catch (err) {
        return next(err);
      }
      res.status(201).json(updateProfile);
    });
  },
  async handleFollow(req, res, next) {
    let user;
    try {
      user = await User.findOne({ _id: req.user._id });
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }
    } catch (err) {
      return next(err);
    }
    const profileSchema = Joi.object({
      followers: Joi.array().required(),
      following: Joi.array().required(),
    });

    const { error } = profileSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { followers, following } = req.body;
    //Update Followers

    let document;
    try {
      document = await Profile.findOneAndUpdate(
        { userId: req.params.id },
        {
          followers: followers,
        },
        { new: true }
      );
    } catch (err) {
      return next(err);
    }
    //Update Following

    try {
      await Profile.findOneAndUpdate(
        { userId: user._id },
        {
          following: following,
        },
        { new: true }
      );
    } catch (err) {
      return next(err);
    }
    res.status(201).json(document);
  },

  async getProfile(req, res, next) {
    let user;
    try {
      user = await User.findOne({ _id: req.user._id });
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }
    } catch (err) {
      return next(err);
    }
    let documents;
    try {
      documents = await Profile.findOne({
        userId: user._id,
      }).select("-updatedAt -__v -_id -createdAt");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    if (!documents) {
      return res.json({});
    }
    return res.json(documents);
  },
  async getProfileUserId(req, res, next) {
    let document;
    try {
      document = await Profile.findOne({ userId: req.params.id })
        .select("-updatedAt -__v")
        .sort({ createdAt: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(document);
  },
  async getFollowersProfile(req, res, next) {
    const profileSchema = Joi.object({
      followers: Joi.array().required(),
    });

    const { error } = profileSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { followers } = req.body;
    let documents;
    try {
      documents = await Profile.find({
        userId: { $in: followers },
      }).select("-updatedAt -__v");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
  async getFollowingProfile(req, res, next) {
    const profileSchema = Joi.object({
      following: Joi.array().required(),
    });

    const { error } = profileSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { following } = req.body;
    let documents;
    try {
      documents = await Profile.find({
        userId: { $in: following },
      }).select("-updatedAt -__v");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
  async searchProfile(req, res, next) {
    let document;
    try {
      document = await Profile.find({
        userName: { $regex: req.params.name, $options: "i" },
      }).select("-updatedAt -__v");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(document);
  },
  async getPopularProfile(req, res, next) {
    let documents;
    try {
      documents = await Profile.find().select("-updatedAt -__v");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    const sortedProfile = documents.sort((a, b) => {
      return b.followers.length - a.followers.length;
    });
    return res.json(sortedProfile);
  },
};
export default profileController;
