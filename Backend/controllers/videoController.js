import { User, Profile, Video } from "../models";
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
    if (file.fieldname === "video") {
      const uniqueName = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
    if (file.fieldname === "thumbnail") {
      const uniqueName = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  },
});
const handleMultipartData = multer({
  storage,
  limits: { fileSize: 2000000000 },
}).fields([
  {
    name: "video",
    maxCount: 1,
  },
  {
    name: "thumbnail",
    maxCount: 1,
  },
]); // 2GB

const handleThumbnail = multer({
  storage,
  limits: { fileSize: 1000000 * 5 },
}).single("thumbnail"); // 5MB

const videoController = {
  async storeVideo(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      const videoPath = req.files.video[0].path;
      const thumbnailPath = req.files.thumbnail[0].path;

      const videoValidator = Joi.object({
        title: Joi.string().required(),
      });

      const { error } = videoValidator.validate(req.body);

      if (error) {
        // Delete Video
        fs.unlink(`${appRoot}/${videoPath}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.serverError(err.message));
          }
        });
        // Delete Thumbnail
        fs.unlink(`${appRoot}/${thumbnailPath}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.serverError(err.message));
          }
        });
        return next(error);
      }

      const { title } = req.body;
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
        document = await Video.create({
          userId: user._id,
          userName: user.name,
          title: title,
          videoUrl: videoPath,
          thumbnailUrl: thumbnailPath,
          profilePic: profilePic,
          likes: [],
          comments: [],
        });
      } catch (err) {
        return next(err);
      }
      res.status(201).json(document);
    });
  },
  async allVideo(req, res, next) {
    let documents;
    try {
      documents = await Video.find()
        .select("-updatedAt -__v")
        .sort({ createdAt: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }

    return res.json(documents);
  },
  
  async streamingVideo(req, res, next) {
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
  },
  
  async userAllVideo(req, res, next) {
    let documents;
    try {
      documents = await Video.find({
        userId: req.params.id,
      })
        .select("-updatedAt -__v")
        .sort({ createdAt: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }

    return res.json(documents);
  },
  async likeVideo(req, res, next) {
    const videoSchema = Joi.object({
      likes: Joi.array().required(),
    });

    const { error } = videoSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { likes } = req.body;
    //Update Likes
    let document;
    try {
      document = await Video.findOneAndUpdate(
        { _id: req.params.videoId },
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

  async commentVideo(req, res, next) {
    const videoSchema = Joi.object({
      comments: Joi.array().required(),
    });

    const { error } = videoSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { comments } = req.body;
    //Update Comments
    let document;
    try {
      document = await Video.findOneAndUpdate(
        { _id: req.params.videoId },
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

  async updateVideo(req, res, next) {
    handleThumbnail(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      
      let thumbnailPath;
      if (req.file) {
        thumbnailPath = req.file.path;
      }

      const videoValidator = Joi.object({
        title: Joi.string().required(),
      });

      const { error } = videoValidator.validate(req.body);

      if (error) {
        // Delete the uploaded file
        if(req.file){
            fs.unlink(`${appRoot}/${thumbnailPath}`, (err) => {
                if (err) {
                    return next(CustomErrorHandler.serverError(err.message));
                }
            });
        }
        return next(error);
    }

      const { title } = req.body;
      let document;
      try {
        document = await Video.findOneAndUpdate(
          { _id: req.params.videoId },
          {
            title: title,
            ...(req.file && { thumbnailUrl: thumbnailPath })
          },
          { new: true }
        );
      } catch (err) {
        return next(err);
      }
      res.status(201).json(document);
    });
  },

  async deleteVideo(req, res, next) {
    const document = await Video.findOneAndRemove({ _id: req.params.videoId });
    if (!document) {
      return next(new Error("Nothing to delete"));
    }
    const videoPath = document._doc.videoUrl;
    const thumbnailPath = document._doc.thumbnailUrl;
    // Delete Video
    fs.unlink(`${appRoot}/${videoPath}`, (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError());
      }
    });
    // Delete Thumbnail
    fs.unlink(`${appRoot}/${thumbnailPath}`, (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError());
      }
    });
    res.json(document);
  },
  async searchVideo(req, res, next) {
    let document;
    try{
        document = await Video.find({ title: { "$regex": req.params.title, "$options" : "i" }}).select('-updatedAt -__v');
    } catch(err){
        return next(CustomErrorHandler.serverError());
    }
    return res.json(document);
},
};
export default videoController;
