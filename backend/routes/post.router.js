import express from "express";
const postRouter = express.Router();


import { createPost, getAllPosts, deletePost, createComment, getAllCommentsForAPost, deleteCommentById, updateLikesCount, dislikePost, getPostInfo } from "../controllers/postController.js";


import uploadPost from "../middlewares/uploadPost.js";
import validatePostMedia from "../middlewares/validatePostMedia.js";

postRouter.post("/post/create", uploadPost.array("media", 5), validatePostMedia, createPost);
postRouter.get("/posts/All", getAllPosts);
postRouter.delete("/post/delete", deletePost);
postRouter.post("/post/add/comment", createComment);
postRouter.get("/post/AllComments/:postId", getAllCommentsForAPost);
postRouter.delete("/post/delete/comment", deleteCommentById);
postRouter.patch("/post/like", updateLikesCount);
postRouter.patch("/post/dislike", dislikePost);
postRouter.get("/post/:postId", getPostInfo);

export default postRouter;