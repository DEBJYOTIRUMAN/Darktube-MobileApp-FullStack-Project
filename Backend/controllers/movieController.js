import { Movie } from "../models";
import multer from "multer";
import path from "path";
import fs from "fs";
import CustomErrorHandler from "../services/CustomErrorHandler";
import Joi from "joi";
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "movies/"),
  filename: (req, file, cb) => {
    if (file.fieldname === "movie") {
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
    name: "movie",
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

const movieController = {
  async storeMovie(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      const moviePath = req.files.movie[0].path;
      const thumbnailPath = req.files.thumbnail[0].path;

      const movieValidator = Joi.object({
        title: Joi.string().required(),
        genres: Joi.string().required(),
        release: Joi.number().required(),
      });

      const { error } = movieValidator.validate(req.body);

      if (error) {
        // Delete Movie
        fs.unlink(`${appRoot}/${moviePath}`, (err) => {
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

      const { title, genres, release } = req.body;
      let document;
      try {
        document = await Movie.create({
          title: title,
          movieUrl: moviePath,
          thumbnailUrl: thumbnailPath,
          likes: [],
          genres: JSON.parse(genres),
          release: release,
        });
      } catch (err) {
        return next(err);
      }
      res.status(201).json(document);
    });
  },
  async allMovie(req, res, next) {
    let documents;
    try {
      documents = await Movie.find()
        .select("-updatedAt -__v")
        .sort({ createdAt: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },

  async streamingMovie(req, res, next) {
    const videoPath = `movies/${req.params.id}`;
    const videoStat = fs.statSync(videoPath);
    const fileSize = videoStat.size;
    const videoRange = req.headers.range;
    if (videoRange) {
      const parts = videoRange.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  },

  async likeMovie(req, res, next) {
    const movieSchema = Joi.object({
      likes: Joi.array().required(),
    });

    const { error } = movieSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { likes } = req.body;
    //Update Likes
    let document;
    try {
      document = await Movie.findOneAndUpdate(
        { _id: req.params.movieId },
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

  async updateMovie(req, res, next) {
    handleThumbnail(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }

      let thumbnailPath;
      if (req.file) {
        thumbnailPath = req.file.path;
      }

      const movieValidator = Joi.object({
        title: Joi.string().required(),
        genres: Joi.string().required(),
        release: Joi.number().required(),
      });

      const { error } = movieValidator.validate(req.body);

      if (error) {
        // Delete the uploaded file
        if (req.file) {
          fs.unlink(`${appRoot}/${thumbnailPath}`, (err) => {
            if (err) {
              return next(CustomErrorHandler.serverError(err.message));
            }
          });
        }
        return next(error);
      }

      const { title, genres, release } = req.body;
      let document;
      try {
        document = await Movie.findOneAndUpdate(
          { _id: req.params.movieId },
          {
            title: title,
            genres: JSON.parse(genres),
            release: release,

            ...(req.file && { thumbnailUrl: thumbnailPath }),
          },
          { new: true }
        );
      } catch (err) {
        return next(err);
      }
      res.status(201).json(document);
    });
  },

  async deleteMovie(req, res, next) {
    const document = await Movie.findOneAndRemove({ _id: req.params.movieId });
    if (!document) {
      return next(new Error("Nothing to delete"));
    }
    const moviePath = document._doc.movieUrl;
    const thumbnailPath = document._doc.thumbnailUrl;
    // Delete Movie
    fs.unlink(`${appRoot}/${moviePath}`, (err) => {
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

  async searchMovie(req, res, next) {
    let document;
    try {
      document = await Movie.find({
        title: { $regex: req.params.title, $options: "i" },
      }).select("-updatedAt -__v");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(document);
  },
};
export default movieController;
