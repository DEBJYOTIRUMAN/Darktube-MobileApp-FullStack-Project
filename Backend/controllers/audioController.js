import { Audio } from "../models";
import multer from "multer";
import path from "path";
import fs from "fs";
import CustomErrorHandler from "../services/CustomErrorHandler";
import Joi from "joi";
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "music/"),
  filename: (req, file, cb) => {
    if (file.fieldname === "audio") {
      const uniqueName = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
    if (file.fieldname === "audioThumbnail") {
      const uniqueName = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  },
});
const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 10 },
}).fields([
  {
    name: "audio",
    maxCount: 1,
  },
  {
    name: "audioThumbnail",
    maxCount: 1,
  },
]); // 10MB

const audioController = {
  async storeAudio(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      const audioPath = req.files.audio[0].path;
      const audioThumbnailPath = req.files.audioThumbnail[0].path;

      const audioValidator = Joi.object({
        name: Joi.string().required(),
        album: Joi.string().required(),
        artists: Joi.string().required(),
      });

      const { error } = audioValidator.validate(req.body);

      if (error) {
        // Delete Audio
        fs.unlink(`${appRoot}/${audioPath}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.serverError(err.message));
          }
        });
        // Delete Audio Thumbnail
        fs.unlink(`${appRoot}/${audioThumbnailPath}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.serverError(err.message));
          }
        });

        return next(error);
      }

      const { name, album, artists } = req.body;

      let document;
      try {
        document = await Audio.create({
          name: name,
          audioUrl: audioPath,
          audioThumbnail: audioThumbnailPath,
          album: album,
          likes: [],
          artists: JSON.parse(artists),
        });
      } catch (err) {
        return next(err);
      }
      res.status(201).json(document);
    });
  },
  async allAudio(req, res, next) {
    let documents;
    try {
      documents = await Audio.find()
        .select("-updatedAt -__v")
        .sort({ createdAt: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }

    return res.json(documents);
  },
  async likeAudio(req, res, next) {
    const audioSchema = Joi.object({
      likes: Joi.array().required(),
    });

    const { error } = audioSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { likes } = req.body;
    //Update Likes

    let document;
    try {
      document = await Audio.findOneAndUpdate(
        { _id: req.params.audioId },
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
  async updateAudio(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }

      let audioPath, audioThumbnailPath;
      if (req.files.audio) {
        audioPath = req.files.audio[0].path;
      }
      if (req.files.audioThumbnail) {
        audioThumbnailPath = req.files.audioThumbnail[0].path;
      }

      const audioValidator = Joi.object({
        name: Joi.string().required(),
        album: Joi.string().required(),
        artists: Joi.string().required(),
      });

      const { error } = audioValidator.validate(req.body);
      if (error) {
        // Delete Audio
        if (req.files.audio) {
          fs.unlink(`${appRoot}/${audioPath}`, (err) => {
            if (err) {
              return next(CustomErrorHandler.serverError(err.message));
            }
          });
        }
        // Delete Audio Thumbnail
        if (req.files.audioThumbnail) {
          fs.unlink(`${appRoot}/${audioThumbnailPath}`, (err) => {
            if (err) {
              return next(CustomErrorHandler.serverError(err.message));
            }
          });
        }

        return next(error);
      }

      const { name, album, artists } = req.body;
      let document;
      try {
        document = await Audio.findOneAndUpdate(
          { _id: req.params.audioId },
          {
            name: name,
            ...(req.files.audio && { audioUrl: audioPath }),
            ...(req.files.audioThumbnail && { audioThumbnail: audioThumbnailPath }),
            album: album,
            likes: [],
            artists: JSON.parse(artists),
          },
          { new: true }
        );
      } catch (err) {
        return next(err);
      }
      res.status(201).json(document);
    });
  },
    async deleteAudio(req, res, next) {
      const document = await Audio.findOneAndRemove({ _id: req.params.audioId });
      if (!document) {
        return next(new Error("Nothing to delete"));
      }
      const audioPath = document._doc.audioUrl;
      const audioThumbnailPath = document._doc.audioThumbnail;
      // Delete Audio
      fs.unlink(`${appRoot}/${audioPath}`, (err) => {
        if (err) {
          return next(CustomErrorHandler.serverError());
        }
      });
      // Delete Audio Thumbnail
      fs.unlink(`${appRoot}/${audioThumbnailPath}`, (err) => {
        if (err) {
          return next(CustomErrorHandler.serverError());
        }
      });

      res.json(document);
    },
    async searchAudio(req, res, next) {
      let document;
      try{
          document = await Audio.find({ name: { "$regex": req.params.name, "$options" : "i" }}).select('-updatedAt -__v');
      } catch(err){
          return next(CustomErrorHandler.serverError());
      }
      return res.json(document);
  },
};
export default audioController;
