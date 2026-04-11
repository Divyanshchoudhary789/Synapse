import express from "express";
const userRouter = express.Router();


import uploadProfile from "../middlewares/uploadProfile.js";
import { signup, login, updateProfilePicture, updateUserInfo, getUserAndProfile, updateUserProfile, getAllUsers, getAllUsersProfiles, downloadUserProfile, sendConnectionRequest, getConnectionRequests, getUserConnections, acceptConnectionRequest, getUserProfileByUserId, getAllUserPosts, getAllUserComments, updateBannerImage, updateProfileSectionBulk, addProfileSectionItem, deleteProfileSectionItem } from "../controllers/userController.js";



userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update/profile-picture", uploadProfile.single("file"), updateProfilePicture);
userRouter.put("/update/banner-image", uploadProfile.single("file"), updateBannerImage);
userRouter.patch("/update-user-info", updateUserInfo);
userRouter.get("/getUserAndProfile", getUserAndProfile);
userRouter.get("/user/profile/:userId", getUserProfileByUserId);
userRouter.put("/update-user-profile", updateUserProfile);
userRouter.get("/users/All", getAllUsers);
userRouter.get("/users/AllProfiles", getAllUsersProfiles);
userRouter.get("/user/download_resume/:userId", downloadUserProfile);
userRouter.post("/user/send_connection_request", sendConnectionRequest);
userRouter.get("/user/getConnectionRequests", getConnectionRequests);
userRouter.get("/user/user_connections", getUserConnections);
userRouter.patch("/user/accept_connection_request", acceptConnectionRequest);
userRouter.get("/user/posts/:userId", getAllUserPosts);
userRouter.get("/user/allComments/:userId", getAllUserComments);

userRouter.patch("/user/profile/update-section", updateProfileSectionBulk);
userRouter.post("/user/profile/add-section-item", addProfileSectionItem);
userRouter.delete("/user/profile/delete-section-item", deleteProfileSectionItem);

export default userRouter;