import { Post, User, Profile } from "../models";
import multer from "multer";
import path from "path";
import fs from "fs";
import CustomErrorHandler from "../services/CustomErrorHandler";
import Joi from "joi";
import { APP_URL } from "../config";
const userImage = `${APP_URL}/uploads/user.png`;
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
  limits: { fileSize: 500000000 },
}).fields([
  {
    name: "image",
    maxCount: 1,
  },
  {
    name: "video",
    maxCount: 1,
  },
]); // 500MB

const postController = {
  async storePost(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      const imagePath = req.files.image[0].path;
      let videoPath;
      if (req.files.video) {
        videoPath = req.files.video[0].path;
      }
      const postValidator = Joi.object({
        caption: Joi.string().required(),
      });

      const { error } = postValidator.validate(req.body);
      if (error) {
        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.serverError(err.message));
          }
        });
        if(req.files.video){
          fs.unlink(`${appRoot}/${videoPath}`, (err) => {
              if (err) {
                  return next(CustomErrorHandler.serverError(err.message));
              }
          });
      }
        return next(error);
      }

      const { caption } = req.body;
      let user;
      try {
        user = await User.findOne({ _id: req.user._id });
        if (!user) {
          return next(CustomErrorHandler.notFound());
        }
      } catch (err) {
        return next(err);
      }
      let profile;
      try {
        profile = await Profile.findOne({
          userId: user._id,
        }).select("-updatedAt -__v -_id -createdAt");
      } catch (err) {
        return next(CustomErrorHandler.serverError());
      }
      let profilePic;
      if (!profile) {
        profilePic = userImage;
      } else {
        profilePic = profile.profilePic;
      }

      let document;
      try {
        document = await Post.create({
          userId: user._id,
          userName: user.name,
          caption: caption,
          imageUrl: imagePath,
          profilePic: profilePic,
          likes: [],
          comments: [],
          ...(req.files.video && { videoUrl: videoPath })
        });
      } catch (err) {
        return next(err);
      }
      res.status(201).json(document);
    });
  },
  async allPost(req, res, next) {
    let documents;
    try {
      documents = await Post.find()
        .select("-updatedAt -__v")
        .sort({ createdAt: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }

    return res.json(documents);
  },
  async userAllPost(req, res, next) {
    let documents;
    try {
      documents = await Post.find({
        userId: req.params.id,
      })
        .select("-updatedAt -__v")
        .sort({ createdAt: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }

    return res.json(documents);
  },
  async likePost(req, res, next) {
    const postSchema = Joi.object({
      likes: Joi.array().required(),
    });

    const { error } = postSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { likes } = req.body;
    //Update Likes
    let document;
    try {
      document = await Post.findOneAndUpdate(
        { _id: req.params.postId },
        {
          likes: likes,
        },
        { new: true }
      );
    } catch (err) {
      return next(err);
    }
    res.status(201).json(document);
  },

  async commentPost(req, res, next) {
    const postSchema = Joi.object({
      comments: Joi.array().required(),
    });

    const { error } = postSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { comments } = req.body;
    //Update Comments
    let document;
    try {
      document = await Post.findOneAndUpdate(
        { _id: req.params.postId },
        {
          comments: comments,
        },
        { new: true }
      );
    } catch (err) {
      return next(err);
    }
    res.status(201).json(document);
  },
  async getProfileByLikes(req, res, next) {
    const postSchema = Joi.object({
      likes: Joi.array().required(),
    });

    const { error } = postSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { likes } = req.body;
    let documents;
    try {
      documents = await Profile.find({
        userId: { $in: likes },
      }).select("-updatedAt -__v");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
  async updateCaption(req, res, next) {
    const postSchema = Joi.object({
      caption: Joi.string().required(),
    });

    const { error } = postSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { caption } = req.body;
    let document;
    try {
      document = await Post.findOneAndUpdate(
        { _id: req.params.postId },
        {
          caption: caption,
        },
        { new: true }
      );
    } catch (err) {
      return next(err);
    }
    res.status(201).json(document);
  },
  async deletePost(req, res, next) {
    const document = await Post.findOneAndRemove({ _id: req.params.postId });
    if (!document) {
      return next(new Error("Nothing to delete"));
    }
    //Image Delete
    const imagePath = document._doc.imageUrl;
    fs.unlink(`${appRoot}/${imagePath}`, (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError());
      }
    });
    res.json(document);
  },
  async streamingPostVideo(req, res, next) {
    const videoPath = `uploads/${req.params.id}`;
    const videoStat = fs.statSync(videoPath);
    const fileSize = videoStat.size;
    const videoRange = req.headers.range;
    if (videoRange) {
        const parts = videoRange.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1;
        const chunksize = (end-start) + 1;
        const file = fs.createReadStream(videoPath, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
  }
};
export default postController;
