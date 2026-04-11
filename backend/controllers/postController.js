import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Comment from "../models/commentModel.js";

import uploadToR2 from "../utils/r2Upload.js";
import mongoose from "mongoose";



const createPost = async (req, res) => {
    try {

        const { token, body } = req.body;
        const files = req.files;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No media uploaded" });
        }

        const media = await Promise.all(
            files.map(async (file) => {
                const result = await uploadToR2(file, "posts");

                return {
                    url: result.url,
                    key: result.key,
                    type: file.mimetype.startsWith("video") ? "video" : "image"
                }
            })
        );


        let postType = "image";
        if (media.length === 1 && media[0].type === "video") {
            postType = "video";
        } else if (media.length > 1) {
            postType = "carousel";
        }


        const newPost = new Post({
            userId: user._id,
            body,
            media,
            postType
        });

        await newPost.save();

        console.log("Post Created Successfully.");
        return res.status(201).json({ message: "Post Created Successfully.", post: newPost });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



const getAllPosts = async (req, res) => {
    try {
        const token = req.headers.authorization;

        const currentUser = await User.findOne({ token });
        if (!currentUser) {
            return res.status(404).json({ message: "User Not Found!" });
        }

        const posts = await Post.find({}).populate("userId", "name username email profilePicture bannerImage");
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "Posts Not Found!" });
        }

        const updatedPosts = posts.map((post) => {
            const postObj = post.toObject();

            return {
                ...postObj,
                likes: post.likes?.length || 0,
                isUserLiked: post.likes?.some((id) => id.toString() === currentUser._id.toString()) || false,
            };
        });

        res.json({ message: "Posts fetched Successfully", posts: updatedPosts });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


const deletePost = async (req, res) => {
    try {
        const { token, postId } = req.body;

        const user = await User.findOne({ token });
        if (!user) {
            return re.status(404).json({ message: "User not found!" });
        }

        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ message: "Post not found!" });
        }

        if (post.userId.toString() !== user._id.toString()) {
            return res.status(400).json({ message: "Unauthorized" })
        }

        const result = await Post.deleteOne({ _id: postId });
        return res.json({ message: "Post deleted Successfully!", result, postId: post._id });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


const createComment = async (req, res) => {
    try {

        const { token, postId, body } = req.body;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({ message: "Post does'nt exists!" });
        }

        const postComment = new Comment({
            userId: user._id,
            postId,
            body,
        });

        await postComment.save();

        return res.json({ message: "Comment Added Successfully." });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



const getAllCommentsForAPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ postId }).populate("userId", "name email username profilePicture bannerImage");
        if (!comments || comments.length === 0) {
            return res.status(404).json({ message: "Comments does'nt exists!" });
        }

        return res.json({ message: "Comments fetched Successfully.", comments });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



const deleteCommentById = async (req, res) => {
    try {
        const { token, commentId } = req.body;


        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found!" });
        }

        if (comment.userId.toString() !== user._id.toString()) {
            return res.status(400).json({ message: "Unauthorized, Access Denied!" });
        }

        const result = await Comment.deleteOne({ _id: commentId });

        return res.json({ message: "Comment deleted Successfully.", result, commentId: comment._id, postId: comment.postId });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



const updateLikesCount = async (req, res) => {
    try {
        const { postId, token } = req.body;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User Not Found!" });
        }


        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found!" });
        }

        if (!post.likes) {
            post.likes = [];
        }

        if (post.likes?.includes(user._id)) {
            return res.status(400).json({ message: "Already Liked" });
        }


        post.likes?.push(user._id);
        await post.save();

        return res.json({ message: "Post Liked Successfully.", likes: post.likes.length });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


const dislikePost = async (req, res) => {
    try {
        const { postId, token } = req.body;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "post not found!" });
        }

        if (!post.likes?.includes(user._id)) {
            return res.status(400).json({ message: "User is already not liking this post" });
        }

        post.likes = post.likes?.filter((id) => id.toString() !== user._id.toString());
        await post.save();

        return res.json({ message: "Post disliked successfully!", likes: post.likes.length });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


const getPostInfo = async (req, res) => {
    try {
        const { postId } = req.params;
        const token = req.headers.authorization;

        const currentUser = await User.findOne({ token });
        if (!currentUser) {
            return res.status(404).json({ message: "User Not Found!" });
        }

        const post = await Post.findById(postId).populate("userId", "name email username profilePicture bannerImage");
        if (!post) {
            return res.status(404).json({ message: "Post Not Found!" });
        }

        const postObj = post.toObject();

        const updatedPost = {
            ...postObj,
            likes: post.likes?.length || 0,
            isUserLiked: post.likes?.some((id) => id.toString() === currentUser._id.toString()) || false,
        }

        return res.json({ message: "Post Info Fetched Successfully", post: updatedPost });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



export { createPost, getAllPosts, deletePost, createComment, getAllCommentsForAPost, deleteCommentById, updateLikesCount, dislikePost, getPostInfo };