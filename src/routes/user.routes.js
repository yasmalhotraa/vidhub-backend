import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

userRouter.route("/login").post(loginUser);

// Secured Routes
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);

userRouter.route("/me").get(verifyJWT, getCurrentUser);

userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword);

userRouter.route("/update-account").post(verifyJWT, updateAccountDetails);

userRouter
  .route("/update-avatar")
  .post(verifyJWT, upload.single("avatar"), updateUserAvatar);

userRouter
  .route("/update-cover")
  .post(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

export default userRouter;
