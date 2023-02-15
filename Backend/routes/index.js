import express from "express";
const router = express.Router();
import {
  registerController,
  loginController,
  userController,
  refreshController,
  profileController,
  postController,
  videoController,
  audioController,
  movieController
} from "../controllers";
import auth from "../middlewares/auth";
import admin from '../middlewares/admin';

// Login Routes
router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/me", auth, userController.me);
router.post("/refresh", refreshController.refresh);
router.post("/logout", auth, loginController.logout);

// Profile Routes
router.post("/profile", auth, profileController.storeProfile);
router.post("/profile/update_pic", auth, profileController.updateProfilePic);
router.post("/profile/update_follow/:id", auth, profileController.handleFollow);
router.get("/profile", auth, profileController.getProfile);
router.get("/profile/user/:id", profileController.getProfileUserId);
router.post("/profile/followers", auth, profileController.getFollowersProfile);
router.post("/profile/following", auth, profileController.getFollowingProfile);
router.get("/profile/search/:name", auth, profileController.searchProfile);
router.get("/profile/popular", profileController.getPopularProfile);

// Post Routes
router.post("/post", auth, postController.storePost);
router.get("/post", postController.allPost);
router.get("/post/:id", auth, postController.userAllPost);
router.post("/post/like/:postId", auth, postController.likePost);
router.post("/post/comment/:postId", auth, postController.commentPost);
router.post("/post/likes", postController.getProfileByLikes);
router.post("/post/caption/:postId", auth, postController.updateCaption);
router.delete("/post/delete/:postId", auth, postController.deletePost);
router.get("/post/video/:id", postController.streamingPostVideo);

//Video Routes
router.post("/video", auth, videoController.storeVideo);
router.get("/video", videoController.allVideo);
router.get("/video/:id", videoController.streamingVideo);
router.get("/video/user/:id", auth, videoController.userAllVideo);
router.post("/video/like/:videoId", auth, videoController.likeVideo);
router.post("/video/comment/:videoId", auth, videoController.commentVideo);
router.put("/video/update/:videoId", auth, videoController.updateVideo);
router.delete("/video/delete/:videoId", auth, videoController.deleteVideo);
router.get("/video/search/:title", auth, videoController.searchVideo);

//Audio Routes
router.post("/audio", [auth, admin], audioController.storeAudio);
router.get("/audio", audioController.allAudio);
router.post("/audio/like/:audioId", auth, audioController.likeAudio);
router.put("/audio/update/:audioId", [auth, admin], audioController.updateAudio);
router.delete("/audio/delete/:audioId", [auth, admin], audioController.deleteAudio);
router.get("/audio/search/:name", auth, audioController.searchAudio);

//Movie Routes
router.post("/movie", [auth, admin], movieController.storeMovie);
router.get("/movie", movieController.allMovie);
router.get("/movie/:id", movieController.streamingMovie);
router.post("/movie/like/:movieId", auth, movieController.likeMovie);
router.put("/movie/update/:movieId", [auth, admin], movieController.updateMovie);
router.delete("/movie/delete/:movieId", [auth, admin], movieController.deleteMovie);
router.get("/movie/search/:title", auth, movieController.searchMovie);

export default router;
